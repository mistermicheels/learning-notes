# Transaction isolation levels

See:

- [PostgreSQL Transaction Isolation](https://www.postgresql.org/docs/current/static/transaction-iso.html)
- [SQL Server SET TRANSACTION ISOLATION LEVEL](https://docs.microsoft.com/en-us/sql/t-sql/statements/set-transaction-isolation-level-transact-sql?view=sql-server-2017)
- [SQL Server Transaction Locking and Row Versioning Guide](https://docs.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide?view=sql-server-2017)

## Basic idea

Goal: Limiting the ways that concurrently executing transactions can affect each other

SQL standard defines phenomena that need to be prevented at different isolation levels.

Note that different implementations may behave in widely different ways, even if they comply with the standard!

## Concurrency phenomena

- *Dirty Read*: A transaction reads data written by a concurrent uncommitted transaction.
- *Non-repeatable Read*: A transaction re-reads data it has previously read and finds that data has been modified by another transaction (that committed since the initial read).
- *Phantom Read*: A transaction re-executes a query returning a set of rows that satisfy a search condition and finds that the set of rows satisfying the condition has changed due to another recently-committed transaction.
- *Serialization Anomaly*: The result of successfully committing a group of transactions is inconsistent with all possible orderings of running those transactions one at a time.

## Isolation levels

(table according to SQL standard)

| Isolation Level  | Dirty Read   | Non-repeatable Read | Phantom Read | Serialization Anomaly |
| ---------------- | ------------ | ------------------- | ------------ | --------------------- |
| Read uncommitted | Possible     | Possible            | Possible     | Possible              |
| Read committed   | Not possible | Possible            | Possible     | Possible              |
| Repeatable read  | Not possible | Not possible        | Possible     | Possible              |
| Serializable     | Not possible | Not possible        | Not possible | Not possible          |

### Read uncommitted

- Least restrictive
  - Even allows Dirty Reads

### Read committed

- Prevents dirty reads
- Can cause statements to block if they depend on data that another transaction has changed but not committed yet
- Identical SELECT statements within the same transaction might still return different data if other transactions have committed in the meantime

### Repeatable read

- Forbids *Dirty Reads* 
- Forbids *Non-repeatable Reads*
  - Only applies to the *contents* of rows that were previously read

Implementations:

- SQL Server
  - Implemented using DB-level locking (basically pessimistic locking)
  - Obtains read lock on rows that you read, causing other transactions attempting to update the row to block until you commit or roll back your transaction

- PostgreSQL
  - Transaction sees a snapshot of the database taken at the start of your transaction (this also prevents *Phantom Reads*)
  - Does not guarantee that the data has not changed in the meantime
    - Still allows other transactions to change the data
    - Fails if your transaction tries to update the data after another transaction has changed it (basically optimistic locking)
  - Note: SQL Server also offers a Snapshot isolation level which behaves similarly to the PostgreSQL Repeatable Read isolation level

### Serializable

- Forbids *Dirty Reads*, *Non-repeatable Reads* and *Phantom Reads*
- Also requires concurrent transactions to behave in a serializable fashion
  - When a set of transactions execute concurrently, there must be some possible sequential execution of the transactions that yields the same results as the results of the concurrent execution
  -  Very strong guarantee, which essentially prevents all phenomena caused by concurrent execution

Implementations:

- SQL Server
  - Implemented using DB-level locking (basically pessimistic locking)
  - Simple row locks not sufficient for preventing *Phantom Reads* -> can also acquire *key-range locks* which are specifically aimed at preventing the insertion of rows that would match a query previously executed by an active Serializable transaction
    - Example: if a Serializable transaction queries for an order and its order lines, the database will prevent other transactions from inserting order lines for the order until the transaction is completed
  - PostgreSQL
    - Similar to *Repeatable Read* (still basically optimistic locking)
    - Checks for all situations that prevent the results of the executed transactions to match some sequential order of execution. If such a situation is detected, the transaction fails.
    - Even the results of SELECT queries are not guaranteed to be valid until the transaction is successfully committed
      - As an alternative, a Serializable Read-only Deferrable transaction can be used. In that case, SELECT statements block until they can return a result that is guaranteed to be valid.
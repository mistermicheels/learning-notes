# Transaction isolation levels

Resources:

- [PostgreSQL Transaction Isolation](https://www.postgresql.org/docs/current/static/transaction-iso.html)
- [SQL Server SET TRANSACTION ISOLATION LEVEL](https://docs.microsoft.com/en-us/sql/t-sql/statements/set-transaction-isolation-level-transact-sql?view=sql-server-2017)
- [SQL Server Transaction Locking and Row Versioning Guide](https://docs.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide?view=sql-server-2017)

## Basic idea

Goal: Limiting the ways that concurrently executing transactions can affect each other

SQL standard defines phenomena that need to be prevented at different isolation levels.

Note that different implementations may behave in widely different ways, even if they comply with the standard!

## Concurrency phenomena

- *Dirty Read*: A transaction reads data written by a concurrent uncommitted transaction.
- *Nonrepeatable Read*: A transaction re-reads data it has previously read and finds that data has been modified by another transaction (that committed since the initial read).
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

Least restrictive, even allows Dirty Reads

### Read committed

Prevents reading uncommitted data from other transactions. This can cause statements to block if they depend on data that another transaction has changed but not committed yet.

Note that identical SELECT statements within the same transaction might still return different data if other transactions have committed in the meantime.

### Repeatable read

The Repeatable Read isolation level is more restrictive than the Read Committed isolation level. In addition to *Dirty Reads*, it also forbids *Non-repeatable Reads*, where a transaction rereads data it has read before and finds that that data has changed. Note that this restriction only applies to the contents of rows that were previously read.

In SQL Server, the Repeatable Read isolation level is implemented using locking. If you read a row, you obtain a shared lock on that row, causing other transactions attempting to update the row to block until you commit or roll back your transaction. This behavior is very similar to pessimistic locking.

In PostgreSQL, the Repeatable Read isolation level behaves quite differently. Your transaction sees a snapshot of the database taken at the start of your transaction (also preventing *phantom reads*). However, this does not guarantee that the data has not changed in the meantime. Let’s say that transaction A reads a row and transaction B then updates that row. This update is not blocked. If transaction A now reads the row again, it will still see the original data (before transaction B changed it). However, if transaction A then tries to make a change to that row, transaction A will fail. This behavior is similar to optimistic locking, but only if transaction A actually tries to update the row.

Note that SQL Server also offers a Snapshot isolation level which behaves similarly to the PostgreSQL Repeatable Read isolation level.

### Serializable

The Serializable transaction isolation level is the most restrictive level. It forbids *dirty reads*, *non-repeatable reads* and *phantom reads*. Additionally, it requires concurrent transactions to behave in a serializable fashion. This means that, when a set of transactions execute concurrently, there must be some possible sequential execution of the transactions that yields the same results as the results of the concurrent execution. This is a very strong guarantee, which essentially prevents all phenomena caused by concurrent execution.

In SQL Server, this isolation level is implemented using locks. As simple row locks are not sufficient for preventing *phantom reads*, it can also acquire *key-range locks* which are specifically aimed at preventing the insertion of rows that would match a query previously executed by an active Serializable transaction. Again, this behavior is very similar to pessimistic locking and it is more powerful than Repeatable read. For example, if a Serializable transaction queries for an order and its order lines, the database will prevent other transactions from inserting order lines for the order until the transaction is completed.

In PostgreSQL, the Serializable isolation level is similar to its Repeatable Read isolation level. However, it now checks for all situations that prevent the results of the executed transactions to match some sequential order of execution. If such a situation is detected, the transaction fails. Note that, when using this isolation level, even the results of SELECT queries are not guaranteed to be valid until the transaction is successfully committed. As an alternative, a Serializable Read-only Deferrable transaction can be used. In that case, SELECT statements block until they can return a result that is guaranteed to be valid.
# It depends

- What technology should I use for my web application’s back end? *It depends*
- Should I use a relational or NoSQL database? And which one? *It depends*
- Should I really have more unit than integration tests? *It depends*
- Is it bad to have an anemic domain model? *It depends*

## Trade-offs

Almost every decision you make when developing or designing software is a trade-off!

Areas to take into account:

- initial development effort
- maintenance effort
- correctness
- performance
- usability

Tradeoffs not only between these factors but also within these areas! E.g. performance for use case A vs performance for use case B

## No perfect solutions!

 *The Best Solution®* or *The Right Way™* typically do not exist!

Every approach will likely have its own drawbacks or limitations that another approach doesn't have.

## Good solutions and flexibility

Instead of looking for perfect solutions, look for two things:

- Good solutions that make sense and for which we don’t see an alternative that is clearly much better
- Flexibility through good architecture and coding practices

Choosing between solutions:

- One that stands out: go for it!
- Hard time choosing: typically means they are all good! implement simplest one!
  - Quickest way to working solution
  - Implementing gives better understanding of problem and benefits/drawbacks of current solution

Flexibility:

- Good architecture and coding practices provide some degree of flexibility to change your choice later on
- How much flexibility do we need? *It depends*
  - Additional flexibility typically comes a the expense of additional layers of abstraction and complexity

## Best practices

Best practices:

- Widely accepted as good solutions
  - If there is one clear best practice approach regarding your problem and you don’t see a significant reason not to use it, just go with that approach!
- Does not mean they are perfect!
  - Some situations where you would be better off using another approach
  - Sometimes even several completely different best practice solutions to the same problem!
    - The more discussion over which is best, the more likely both are valid options

## Documenting the decision process

Document options, trade-offs, ...

Helps to reevaluate approach at a later time if new option pops up or situation changes!

## Moving to a different approach

Even if architecture and code are flexible, there are some costs and risks associated with making the change. The benefits of switching to the other approach may or may not outweigh those costs and risks. 

So, should you make the change? *It depends.*




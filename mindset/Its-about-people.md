---
description: Why software development is about people rather than computers
last_modified: 2021-01-03T11:43:26.326Z
---

# It's about people

## Contents

-   [Basic idea](#basic-idea)
-   [Team performance](#team-performance)
    -   [Psychological safety](#psychological-safety)
    -   [Some general tips](#some-general-tips)
-   [Dealing with customers](#dealing-with-customers)
-   [Code](#code)
-   [Architecture](#architecture)
-   [Resources](#resources)

## Basic idea

At first sight, it might seem that software development is about computers. In reality, however, professional software development is about people at least as much as it is about computers:

-   You will typically work in a team of developers and you need to coordinate your efforts so you can work together as effectively as possible
-   You will be discussing designs and approaches with colleagues and getting feedback on the code you write
-   The software you write has no value unless it is actually valuable to the people who are using it. This means that there needs to be a lot of communication with sales, customers and product management to understand what exactly you're building, what is important and what's not, how certain processes work, whether there are some alternative paths you could take, ...

This means that soft skills are often at least as important as hard skills. As an extreme example, a team of antisocial geniuses that hate each other will be a lot less effective than a tight-knit team of somewhat competent people who are open to feedback from customers and each other.

## Team performance

### Psychological safety

A high-performing team needs competent people. However, when Google conducted a study regarding the ingredients of successful teams, they found that _who_ is an a team matters a lot less than how the team members interact with each other, how they organize their work and how they view the value of their work.

By far, the most important factor turned out to be **psychological safety**. Some signs that a team feels psychologically safe:

-   People know the team has got their back if they admit a mistake they made
-   People know they can always ask for help and receive it
-   People know that, when they ask for help or clarification, they will not be judged for it
-   People feel comfortable both giving and receiving feedback
-   ...

Without psychological safety, people will avoid asking each other for help, try to cover up mistakes until they get too big to hide, avoid getting more information when they need it for fear of looking dumb, avoid taking on new responsibilities (or temporarily taking on part of somebody else's responsibilities) and avoid trying things if they're not 100% sure they will succeed (thus eliminating the potential for innovation and growth)

If you're wondering whether you're working in a psychologically safe team, you can ask yourself these 7 survey questions (recommended by [Amy Edmondson](https://www.hbs.edu/faculty/Pages/profile.aspx?facId=6451)):

1.  If you make a mistake on this team, it is often held against you.
2.  Members of this team are able to bring up problems and tough issues.
3.  People on this team sometimes reject others for being different.
4.  It is safe to take a risk on this team.
5.  It is difficult to ask other members of this team for help.
6.  No one on this team would deliberately act in a way that undermines my efforts.
7.  Working with members of this team, my unique skills and talents are valued and utilized.

You can also look for situations where team members admit they messed up, ask for help, ask for opinions, disagree with someone, ... Does this result in other team members being helpful and in constructive discussions? Is constructive feedback met with curiosity and gratitude rather than hostility? If discussions get heated, how is the atmosphere in the team after the discussion?

Some other signs of safety include laughter, people taking initiative to do small (or big) things for their teammates, lively meetings and a desire to spend time together. 

In a psychologically safe team, you can have a meeting full of passionate and heated discussions and people heavily disagreeing with each other, only to walk out of that meeting joking around and making plans to grab a beer with the entire team.

### Some general tips

-   If you are stuck, feel you are missing some information, or would just like some feedback on your approach: ask! Helping each other out is not only beneficial to the outcome of the current task, but also strengthens the bond between team members.
-   Don't hesitate to do something small (or even big) for your team mates if you see they could use it
-   Share credit whenever you can. When you accomplish something, make sure to mention who else helped or contributed to the success.
-   When something goes wrong, focus on finding the systemic root cause rather than who caused this particular issue
-   Avoid putting unnecessary pressure on your team mates when you're under pressure yourself
    -   However, don't be afraid to ask the team if there's anyone who can help share the load
-   "No matter how correct you are, you won't get anywhere by making the other person feel stupid." ([source](https://news.ycombinator.com/item?id=23100530))

## Dealing with customers

-   Your customers are the reason your company and the system you're building even exist, which means it's essential to listen to them and understand their needs
    -   Note: This doesn't mean you always have to blindly agree with them. But still, it's important to be constructive and helpful.
-   Customers are people too, and getting along well with a customer can have a huge impact on the project. Regardless of the actual work you deliver, a customer who likes you and feels understood will be more willing to gather useful input, consider alternative solutions that you provide, adjust schedules if needed, promote your company towards others, ...
-   Handling support tickets from customers can be extremely valuable to developers because it shows you how customers view the system you created, how they are using it, how helpful the error messages are to them when they made a mistake, ...
    -   Note: Apart from the people side, handling support tickets can also give you a much better idea of how easy the system is to troubleshoot from the point of view of a support person and whether you need better logs, metrics, ...

## Code

Write code for people, not for computers

-   The code you write will likely be read tons of times later on (both by you and other developers)
-   When adding new code, people often spend more time looking at older code than writing the new code itself
    -   You want to properly understand how the new code fits in with the rest of the system, avoid reinventing the wheel or creating bad duplication, stay consistent with other parts of the codebase where it makes sense, ...
-   The computer itself doesn't care if your code is an unreadable mess or not
    -   _"Any fool can write code that a computer can understand. Good programmers write code that humans can understand."_ - Martin Fowler
-   Often, a readable piece of decently performant code adds way more value to the codebase than a hard-to-read piece of heavily optimized code

Some tips:

-   Be explicit
    -   Use names that make it immediately clear what value a variable holds or what a function does
    -   Don't aim for the shortest possible code, instead aim for code that explicitly walks the reader through what it is doing
    -   Use a folder structure that immediately makes it clear what functionality sits where
-   Don't try to be too clever
-   See also [Keep it simple - Code](./Keep-it-simple.md#code)

People are also the reason why consistency, coding standards, automation, ... are so important

-   It's about making it easier to collaborate on the codebase and maintain it, not wasting people's time and energy on things that computers are better at, preventing human errors, ...

## Architecture

See also [Architecture and people](../architecture-design/Architecture-people.md)

## Resources

-   [Working as a Software Developer](https://henrikwarne.com/2012/12/12/working-as-a-software-developer/)
-   [7 Questions To Help You Find Out If Your Team Feels Psychologically Safe](https://hackernoon.com/7-questions-to-help-you-find-out-if-your-team-feels-psychologically-safe-wvcr3y60)
-   [The five keys to a successful Google team](https://rework.withgoogle.com/blog/five-keys-to-a-successful-google-team/)
-   [Lessons Learned in Software Development](https://henrikwarne.com/2015/04/16/lessons-learned-in-software-development/)
-   Clean Code (book by Robert C. Martin) (especially the 1st chapter)

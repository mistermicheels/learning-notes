---
description: Why different aspects of the code should be kept separate
last_modified: 2022-01-31T10:44:35.236Z
---

# Separation of concerns

## Contents

-   [Basic idea](#basic-idea)
-   [Example: financial report generator](#example-financial-report-generator)
    -   [Implementation without proper separation of concerns](#implementation-without-proper-separation-of-concerns)
    -   [Implementation with proper separation of concerns](#implementation-with-proper-separation-of-concerns)
-   [Resources](#resources)

## Basic idea

Separation of concerns: separate code for doing different kinds of things

-   Examples of different kinds of things: data retrieval, business logic and presentation
-   Separate into different functions, classes or even parts of the codebase

See also [SOLID principles - Single responsibility principle (SRP)](./oo-design/SOLID-principles.md#single-responsibility-principle-srp)

Benefits:

-   Low coupling: code for doing one thing can be changed independently of code doing other things
-   High cohesion: all of the code for doing one thing sits together, so if you have to make changes you don't need to go looking around the codebase for bits and pieces of code doing this thing
-   Easier to make changes
    -   You will likely need to change less code (only the code for things that are relevant to the change you need to make)
    -   If the changes you need to make are related to a particular thing, the change is much easier because all the code for that particular thing sits together and you can change it without having to fully understand other code that does other things
    -   If you only touch code doing a particular thing, you are unlikely to break code doing other things
    -   You could even completely swap out code doing one thing, without having to touch code doing other things
    -   Putting all data access code together makes it a lot easier to reason about indexes etc.
-   Easier to test: can test one thing in isolation without being bothered by other aspects
    -   Also related to [Humble Object pattern - Values as boundaries](./Humble-Object-pattern.md#values-as-boundaries)

Writing code that properly separates concerns can be a bit more challenging than writing code that just throws everything together, but the effort will very quickly pay off through better maintainability

Some things to separate:

-   Business logic and data access
-   Business logic and input validation
-   Business logic and authorization
-   Business logic and presentation
-   Structure of presentation and styling of presentation
-   Different kinds of business logic

General question to ask yourself: _"Should this (function/class/subsystem) know about this (concept/calculation/structure)?"_

## Example: financial report generator

Use case: read data on department costs and revenues from DB and generate an HTML report comparing actual revenue to the target revenue as calculated based on cost

### Implementation without proper separation of concerns

```java
public class FinancialReportGenerator {
    public String generateReport(Connection connection) throws SQLException {
        String html = "<html><head></head><body><table>"
                + "<tr><th>Department</th><th>Costs</th><th>Revenue</th>"
                + "<th>Revenue target</th><th>Above/below target</th></tr>";

        String sql = "SELECT * FROM public.department_results";
        PreparedStatement statement = connection.prepareStatement(sql);
        ResultSet resultSet = statement.executeQuery();

        while (resultSet.next()) {
            html = html + "<tr>";

            String departmentName = resultSet.getString("department_name");
            html = html + "<td>" + departmentName + "</td>";

            int costs = resultSet.getInt("costs");
            int revenue = resultSet.getInt("revenue");
            html = html + "<td>" + costs + "</td>";
            html = html + "<td>" + revenue + "</td>";

            int target;

            if (costs > 100) {
                target = costs + 50;
            } else {
                target = costs + 30;
            }

            html = html + "<td>" + target + "</td>";

            int difference = revenue - target;

            if (difference >= 0) {
                html = html + "<td>" + difference + "</td>";
            } else {
                String style = "color: red; font-weight: bold;";
                html = html + "<td style=\"" + style + "\">" + difference + "</td>";
            }

            html = html + "</tr>";
        }

        html = html + "</table></body></html>";
        return html;
    }
}
```

Some problems with this:

-   Hard to read
    -   Can you look at the code and immediately tell me what the DB structure looks like?
    -   Can you look at the code and immediately tell me how target revenues are calculated?
-   Hard to test
    -   Calculation of target revenues is important business logic that is likely to get even more complex, which means we'd really like to unit test all of the different cases
    -   Currently, the only way to test the calculation of target revenues is to provide some kind of DB connection and check the generated HTML
        -   Test will be slow because they need a DB (we could use an in-memory DB, but still it will be relatively slow)
        -   It's hard to set up correct data for the tests (need to properly fill DB)
        -   We need to compare entire HTML results while we actually only care about the calculation in these unit tests
        -   Any change in generated HTML (styles etc.) requires us to change the expected HTML for all of our test cases
-   Hard to maintain or extend
    -   Target revenue calculation hard to maintain because it's so hard to test all its different cases
    -   What if we want to change the order of columns in the report?
    -   What if we want to use nested HTML lists instead of a table?
    -   What if we want to get the department data from a CSV file instead of from a DB?
    -   What if we want to compare results from different ways of calculating target revenue?
    -   What if we want to output HTML as well as a PDF? Or allow users to choose which one they want?

### Implementation with proper separation of concerns

```java
public class FinancialReportGenerator2 {
    public String generateReport(Connection connection) throws SQLException {
        var departmentResultsRetriever = new DepartmentResultsRetriever();
        var targetRevenueCalculator = new TargetRevenueCalculator();
        var reportDataGenerator = new FinancialReportDataGenerator(targetRevenueCalculator);
        var reportFormatter = new FinancialReportFormatter();

        List<DepartmentResult> departmentResults = departmentResultsRetriever
                .getDepartmentResults(connection);

        List<FinancialReportDataEntry> reportData = reportDataGenerator
                .getReportData(departmentResults);

        return reportFormatter.getReportHtml(reportData);
    }
}

public class DepartmentResultsRetriever {
    public List<DepartmentResult> getDepartmentResults(
            Connection connection) throws SQLException {
        List<DepartmentResult> departmentResults = new ArrayList<>();
        
        String sql = "SELECT * FROM public.department_results";
        PreparedStatement statement = connection.prepareStatement(sql);
        ResultSet resultSet = statement.executeQuery();

        while (resultSet.next()) {
            departmentResults.add(new DepartmentResult(
                    resultSet.getString("department_name"),
                    resultSet.getInt("costs"),
                    resultSet.getInt("revenue")));

        }

        return departmentResults;
    }
}

public class DepartmentResult {
    public final String departmentName;
    public final int costs;
    public final int revenue;

    public DepartmentResult(String departmentName, int costs, int revenue) {
        this.departmentName = departmentName;
        this.costs = costs;
        this.revenue = revenue;
    }
}

public class FinancialReportDataGenerator {
    private TargetRevenueCalculator targetRevenueCalculator;

    public FinancialReportDataGenerator(TargetRevenueCalculator targetRevenueCalculator) {
        this.targetRevenueCalculator = targetRevenueCalculator;
    }

    public List<FinancialReportDataEntry> getReportData(
            List<DepartmentResult> departmentResults) {
        List<FinancialReportDataEntry> data = new ArrayList<>();

        for (DepartmentResult departmentResult : departmentResults) {
            int targetRevenue = this.targetRevenueCalculator
                    .calculateTargetRevenue(departmentResult.costs);

            int differenceWithTarget = departmentResult.revenue - targetRevenue;

            data.add(new FinancialReportDataEntry(
                    departmentResult.departmentName,
                    departmentResult.costs,
                    departmentResult.revenue,
                    targetRevenue,
                    differenceWithTarget));
        }

        return data;
    }
}

public class FinancialReportDataEntry {
    public final String departmentName;
    public final int costs;
    public final int revenue;
    public final int targetRevenue;
    public final int differenceWithTarget;

    public FinancialReportDataEntry(String departmentName, int costs, int revenue,
            int targetRevenue, int differenceWithTarget) {
        this.departmentName = departmentName;
        this.costs = costs;
        this.revenue = revenue;
        this.targetRevenue = targetRevenue;
        this.differenceWithTarget = differenceWithTarget;
    }
}

public class TargetRevenueCalculator {
    public int calculateTargetRevenue(int costs) {
        if (costs > 100) {
            return costs + 50;
        } else {
            return costs + 30;
        }
    }
}

public class FinancialReportFormatter {
    public String getReportHtml(List<FinancialReportDataEntry> data) {
        String html = "<html><head></head><body><table>"
                + "<tr><th>Department</th><th>Costs</th><th>Revenue</th>"
                + "<th>Revenue target</th><th>Above/below target</th></tr>";

        for (FinancialReportDataEntry dataEntry : data) {
            html = html + "<tr>";

            html = html + "<td>" + dataEntry.departmentName + "</td>";
            html = html + "<td>" + dataEntry.costs + "</td>";
            html = html + "<td>" + dataEntry.revenue + "</td>";
            html = html + "<td>" + dataEntry.targetRevenue + "</td>";

            if (dataEntry.differenceWithTarget >= 0) {
                html = html + "<td>" + dataEntry.differenceWithTarget + "</td>";
            } else {
                String style = "color: red; font-weight: bold;";
                
                html = html 
                        + "<td style=\"" + style + "\">"
                        + dataEntry.differenceWithTarget
                        + "</td>";
            }

            html = html + "</tr>";
        }

        html = html + "</table></body></html>";
        return html;
    }
}
```

Comparison with earlier implementation:

-   There is obviously more code. However, every method is now a lot simpler than our big method from before and each of them has a clear purpose.
-   Easy to read
    -   One look at `DepartmentResultsRetriever` shows us what the DB structure looks like
    -   One look at `TargetRevenueCalculator` shows us how target revenues are calculated
-   Easy to test
    -   Testing target revenue calculation in `TargetRevenueCalculator` has become almost trivially easy
    -   If we want to test HTML generation, it's easy to generate report data for different cases
-   Easy to maintain or extend
    -   For a lot of potential changes, we only need to touch one small part of the codebase
    -   If we want to change the order of columns in the report, we only need to touch `FinancialReportFormatter` and we can be sure we didn't break the actual calculation
    -   Same if we want to use nested HTML lists instead of a table
    -   If we want to get the department data from a CSV file instead of from a DB, we only need to touch `DepartmentResultsRetriever` and make sure that `FinancialReportGenerator2` feeds it a file instead of a DB connection.  As long as we return a correct list of `DepartmentResult` objects, we can be sure that the report generation still works.
        -   We could also create different `DepartmentResultsRetriever` classes and choose which one to use in which case. With a bit of work, we can make connection/files into constructor arguments and make all of those `DepartmentResultsRetriever` implement the same interface, allowing even more flexibility.
        -   If needed, it's easy to test the retrieval separately without having to worry about the calculation and presentation of the report
    -   If we want to compare results from different ways of calculating target revenue, we just need to create different `TargetRevenueCalculator` classes implementing a common interface and then plug them into `FinancialReportDataGenerator` as needed
    -   If we want to allow users to choose whether to get back HTML or a PDF, the only thing we need to do is add an alternative report formatter. We don't need to touch any of the data retrieval or calculation logic

## Resources

-   [Separation of Concerns](https://deviq.com/separation-of-concerns/)
-   [Programming Fundamentals Part 5: Separation of Concerns (Software Architecture)](https://medium.com/@rkay301/programming-fundamentals-part-5-separation-of-concerns-software-architecture-f04a900a7c50)
-   [How do you explain Separation of Concerns to others?](https://softwareengineering.stackexchange.com/questions/32581/how-do-you-explain-separation-of-concerns-to-others)
-   [Separation of Concerns](https://effectivesoftwaredesign.com/2012/02/05/separation-of-concerns/)

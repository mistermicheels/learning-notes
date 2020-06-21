---
tree_title: Date and Time API
description: An overview of the Java Date and Time API
last_modified: 2020-05-30T15:54:15+02:00
---

# Date and Time API (Java)

## Contents

-   [Date and Time API basics](#date-and-time-api-basics)
-   [Instants and Durations](#instants-and-durations)
-   [Local dates and time](#local-dates-and-time)
    -   [Local dates](#local-dates)
    -   [Temporal adjusters](#temporal-adjusters)
    -   [Local time](#local-time)
-   [Zoned time](#zoned-time)
-   [Formatting and parsing dates](#formatting-and-parsing-dates)
-   [Resources](#resources)

## Date and Time API basics

Java 1.0 had `Date`, most methods deprecated with introduction of `Calendar` in Java 1.1. Still not perfect (sometimes awkward API, didn't deal with leap seconds, ...) -> the recommendation used to be to use a library like Joda Time instead.

Java 8 introduced a new Data and Time API under `java.time`, which solves a lot of the issues with the older solutions.

Some key points:

-   All instances of `java.time` objects are immutable (operations that change dates or times return new objects)
-   A day has exactly 86400 seconds (leap seconds are dealt with by making seconds last a little bit longer)

## Instants and Durations

 `Instant`: represents a point on the time line

`Duration`: represents the amount of time between two instants

```java
Instant start = Instant.now();
// perform some computations
Instant end = Instant.now();
Duration timeElapsed = Duration.between(start, end);
long millis = timeElapsed.toMillis();
```

```java
Duration oneWeek = Duration.ofDays(7);
long secondsInWeek = oneWeek.toSeconds();
```

Computations with durations:

-   Option 1: use methods directly on durations 
-   Option 2: convert to nanoseconds
    -   Note that a long of nanoseconds doesn't allow you to use the entire range of a `Duration`, but it a long can hold almost 300 years worth of nanoseconds

```java
// Option 1
if (duration1.multipliedBy(10).minus(duration2).isNegative()) {
    // ...
}

// Option 2
if (duration1.toNanos() * 10 < duration2.toNanos()) {
    // ...
}
```

## Local dates and time

Local date/time: has a date and/or time of day, but no time zone information

Example use cases: 

-   Someone's birthday (this refers to a certain calendar date, but not to a precise instant on the time line)
-   Calculations with date and time when you want to ignore time zones and don't want daylight savings time to be taken into account
    -   Example: a meeting that is at 10:00 every 7 days (regardless of daylight savings time)
    -   Note: you can also ignore daylight savings time when working with zoned times, see below

### Local dates

```java
LocalDate today = LocalDate.now();
LocalDate test1 = LocalDate.of(2019, 8, 28);
LocalDate test2 = LocalDate.of(2019, Month.AUGUST, 28);
System.out.println(test1.equals(test2)); // true
```

```java
LocalDate programmersDay = LocalDate.of(2019, 1, 1).plusDays(255);
```

```java
// Duration.ofYears(1) wouldn't produce the correct result in a leap year
LocalDate birthdayNextYear = birthday.plus(Period.ofYears(1));
```

```java
today.until(christmas, ChronoUnit.DAYS) // get # days until Christmas
```

Note: methods adjusting dates don't throw exceptions if the result would be invalid but adjust it to a valid date instead!

```java
LocalDate test = LocalDate.of(2016, 1, 31).plusMonths(1);
System.out.println(test); // 2016-02-29
```

### Temporal adjusters

Example: compute first Tuesday of a month

```java
LocalDate firstTuesday = LocalDate.of(year, month, 1).with(
TemporalAdjusters.nextOrSame(DayOfWeek.TUESDAY))
```

### Local time

```java
LocalTime currentTime = LocalTime.now();
LocalTime bedTime = LocalTime.of(00, 30);
LocalTime alarmTime = bedTime.plusHours(8);
```

## Zoned time

Zoned time: date and time plus time zone information

-   Represents particular instant in time
-   When performing calculations or transforming between time zones, daylight savings time and time zone rules are taken into account

```java
ZonedDateTime apolloLaunch = ZonedDateTime.of(1969, 7, 16, 9, 32, 0, 0,   
    ZoneId.of("America/New_York"));
    
System.out.println(apolloLaunch); // 1969-07-16T09:32-04:00[America/New_York]
```

```java
Instant now = Instant.now();
ZonedDateTime nowInUtc = now.atZone(ZoneId.of("UTC"));
```

```java
// Duration.ofDays(7) wouldn't work with daylight savings time
ZonedDateTime nextMeeting = currentMeeting.plus(Period.ofDays(7))
```

Note: there is also `OffsetDateTime`, which uses a fixed offset from UTC. This is useful for some technical applications like network protocols. For dealing with human time, `ZonedDateTime` is typically the best option.

## Formatting and parsing dates

The `DateTimeFormatter` class now replaces the old `DateTimeFormat` (you can still call `toFormat()` on a `DateTimeFormatter` to get a legacy `DateTimeFormat`)

```java
// predefined ISO_OFFSET_DATE_TIME format (ISO-8601-compliant)
String formatted = DateTimeFormatter.ISO_OFFSET_DATE_TIME.format(ZonedDateTime.now());
System.out.println(formatted); // 2019-08-28T16:02:07.5384469+02:00
```

```java
DateTimeFormatter formatter = DateTimeFormatter.ofLocalizedDateTime(FormatStyle.LONG);
String formatted = formatter.format(ZonedDateTime.now());
System.out.println(formatted); // August 28, 2019 at 4:05:04 PM CEST
```

```java
LocalDate parsed1 = LocalDate.parse("2019-08-28");
DateTimeFormatter patternFormatter = DateTimeFormatter.ofPattern("yyyy/dd/MM");
LocalDate parsed2 = LocalDate.parse("2019/28/08", patternFormatter);
System.out.println(parsed1.equals(parsed2)); // true

// throws DateTimeParseException
LocalDate parsed3 = LocalDate.parse("2019/08/28", patternFormatter);
```

## Resources

-   Core Java SE 9 for the Impatient (book by Cay S. Horstmann)

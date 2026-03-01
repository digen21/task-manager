# Why chosenDB model

## Relational Data Structure:

- Used Relational Data Structure as the project is mainly based on the relation like
- User -> organization
- Organization -> Project
- Project -> Task
- Project -> ActivityLogs
- In such case can handle relations efficiently

## TypeORM Benefits:

- Provide SQL method directly to execute
- No need to write the migration manually, entities can handle it.
- Also provides query chaining and raw query support.
- Type-safe Query Builder
- Decorator based, easy to manage + clean code

# What was deprioritized & Tradeoffs made:

- As currently this is MVP ready, deprioritized things are:

- Refresh tokens for JWT, account lockout after failed
  logins, social-login (i.e. through slack)

- Performance Optimizations: No caching yet used + basic pagination

- Monitoring & Observability: NO APM service is integrated to get to know about system performance (i.e. new relic)

- Manage Proper code structure. Can manage common entities where needed

- Can manage database properly. Loose Query Chaining

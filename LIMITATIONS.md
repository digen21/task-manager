# Known weaknesses:

- Single Access token, no refresh token
- Loose query caching
- Proper Index -> this can be added, once we about know slow data fetching
- Maintain Proper code structure (Converting function based controller into class based)
- Proper configuration for the Security (cors, helmet)
- Logging only error logs mostly.

# Client Side weaknesses:

- Token storage in the Localstorage
- Require Proper authentication from client side
- Not heavily state-management (like sharing states across the component using state library like zustand)

# What would be improved with more time:

- Resolving above mentioned weaknesses

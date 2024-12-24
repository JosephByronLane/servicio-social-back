# Error handling
## Overview

Generally there isn't much to say here.
If the API does anything succesfully, it'll return a `status:200` if you query or a `status:201` if you create something.

---
## Body and query params

Generally speaking, the API always queries parameters and tells you if something is wrong, missing, or in the wrong format.

So make sure to always log any errors in the console so you can debug them.

The only time you should be worried if the API returns a 

**Status**: `500`
```json

{
    "message": 'Internal server error'
}
```


---


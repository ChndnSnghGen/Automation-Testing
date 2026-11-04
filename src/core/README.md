# core

**Why this exists:** code every module needs, so it is written once.

| Folder | Holds |
| --- | --- |
| `config/` | Environment, base URL, timeouts |
| `pages/` | `BasePage`, the parent of every page object |
| `components/` | Shared UI widgets (`UserMenu`) |
| `data/` | Shared synthetic data factories |
| `utils/` | Small generic helpers |

**Rule:** `core` must never import from `src/modules/*`. This prevents circular dependencies.

**Example: how a module uses core**

```ts
import { BasePage } from '@core/pages/BasePage';           // parent class
import { UserMenu } from '@core/components/UserMenu';      // shared widget
import { APP_STARTUP_TIMEOUT } from '@core/config/timeouts';
import { requiredEnv } from '@core/config/env';            // fails fast if a secret is missing
```

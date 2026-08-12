# Agent Rules & Behavioral Guidelines

## 🔒 LOCKED COMBAT BASELINE PARAMETERS

When modifying layout styles or adding new features (such as Mini Boss scaling, Boss aura effects, animations, or UI updates), **DO NOT ALTER OR BREAK** the following locked CSS baseline positions in `game/css/layout.css`:

1. **Entity Container**:
   - `.entity { height: 190px; justify-content: flex-end; }`

2. **Character Ground Heights**:
   - `#player-img { position: relative; top: -14px; }` (Player boots standing on grass).
   - `#zombie-img { position: relative; top: -26px; }` (Zombie sneakers standing on grass, aligned horizontally with player boots).

3. **HUD Order & Alignment**:
   - `.entity-name { order: -2; margin-bottom: 4px; }` (Name tag at the top).
   - `.hp-container { order: -1; }` (HP bar below name tag).
   - `#player-entity .hp-container { margin-bottom: 26px; }` (Player HP bar in sky).
   - `#monster-entity .hp-container { margin-bottom: 38px; }` (Monster HP bar in sky, horizontally aligned with Player HP bar).

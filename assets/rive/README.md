# Drop your .riv files here

The page looks for these files (see the `data-rive-src` attributes in `index.html`):

| File               | Where it shows up                          |
|--------------------|--------------------------------------------|
| `hero.riv`         | Mascot in the bottom-left of the hero card |
| `mini-1.riv`       | First small highlight card                 |
| `mini-2.riv`       | Second small highlight card                |
| `mini-3.riv`       | Third small highlight card                 |
| `project-hero.riv` | Big featured project frame                 |
| `project-2.riv`    | Second project frame                       |
| `quote-1.riv`      | First testimonial thumbnail                |
| `quote-2.riv`      | Second testimonial thumbnail               |

Until a file exists, slots marked `data-rive-fallback="demo"` play Rive's public
vehicles demo, and the rest show an animated placeholder. To run a specific
state machine, set `data-state-machine="YourStateMachine"` on the slot.

Export from the Rive editor with **Download → For runtime (.riv)**.

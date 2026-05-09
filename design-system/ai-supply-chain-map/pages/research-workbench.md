# Research Workbench Override

This page overrides the generated UIPro master where the master suggests an OLED dark landing style.

## Product Fit

Use the UIPro `Data-Dense Dashboard` guidance, not the landing-page guidance. This product is a research workbench for repeated reading, comparison, and model inspection.

## Visual Direction

- Default to a light, high-contrast research interface.
- Avoid a dominant dark slate/green terminal look.
- Use restrained color accents only for state, selected nodes, scores, and risk.
- Keep cards compact with 8px radius.
- Do not use marketing hero sections.
- Do not use decorative gradient orbs or atmospheric backgrounds.

## Layout Rules

- Left pane: graph exploration.
- Right pane: node analysis, buyability card, model, version history.
- Middle divider must be draggable on desktop.
- Mobile stacks graph above analysis.
- Text must remain readable for non-expert users; every number needs explanatory context.

## Interaction Rules From UIPro

- Visible focus states for all interactive elements.
- Keyboard-reachable search, graph fallback node list, history, and model controls.
- Cursor pointer on clickable elements.
- Hover states should change color/border/shadow without scaling layout.
- Respect `prefers-reduced-motion`.


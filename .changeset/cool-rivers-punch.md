---
"victory-native": major
---

Updated useSliceAngularInsetPath to return path only

- This is a breacking change as the hook signature is different.
- The change is made to fix a bug so that `useSliceAngularInsetPath`'s consumers provide their own styling to the `<Path />` component. For `<PieSliceAngularInset />` the supplied `paint` param is buggy (unknown root cause) and we do not need to pass `paint` param. Switched to `style`, `color` and `strokeWidth` as an alternative.
- Existing consumers can update their code as follow:

OLD

```tsx
const [path, insetPaint] = useSliceAngularInsetPath({ slice, angularInset });
<Path path={path} paint={insetPaint} />;
```

NEW:

```tsx
const path = useSliceAngularInsetPath({ slice });
<Path path={path} style="stroke" color={angularInset.angularStrokeColor} strokeWidth={angularInset.angularStrokeWidth} />;
```

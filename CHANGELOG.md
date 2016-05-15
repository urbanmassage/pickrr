# next
- BREAKING: `undefined` is now returned instead of `null` for mismatched types (like invalid dates)
- BREAKING: all *pickrr* types are now functions. This shouldn't change anything except if you rely on the actual values of *pickrr* types like `string` and `number` for some reason.
- NEW: `oneOf` type
- NEW: string literals & numeric values support

# 0.5.0
- *pickrr* no longer throws when it finds an incorrect type in non-required mode. It returns null instead.

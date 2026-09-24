# Compile

`.faf` is the source. `.fafb` is the same context compiled — a binary a machine can index without reading it. The brick.

You do not have to use it. A `.faf` alone is a complete, portable file. Compile when something needs to load context fast, cache it by hash, or fit it to a token budget without deciding what to drop at runtime.

## Write one

```bash
faf compile                    # project.faf → project.fafb
faf compile other.faf          # a named source
faf compile --output ctx.fafb  # a named output
```

```
compiled project.fafb (592 bytes)
```

`faf compile` will not overwrite a file it cannot prove it wrote. Use `--force` when you mean it.

## Read one back

```bash
faf decompile project.fafb
```

```json
{
  "version": "2.0",
  "flags": 64,
  "section_count": 8,
  "total_size": 592,
  "source_checksum": "0xed7188cb",
  "sections": [
    { "name": "faf_version", "priority": 255, "length": 19, "token_count": 4 }
  ]
}
```

Decompile prints structure, not the original file. The `.faf` stays the thing you edit.

## What is inside

| Part | Holds |
|---|---|
| Header, 32 bytes | magic, wire version, flags, a CRC32 of the source, offsets |
| Sections | one per chunk, in a fixed order |
| Section table, at the end | name, priority, offset, length per chunk — so a reader finds any chunk without scanning |

Each chunk carries a **priority**. A reader fitting a brick into a token budget drops whole tiers from the tail, so what is left is always the front of the file. Identity chunks never drop.

## It is not a compressor

On a small `.faf` the brick comes out **larger than its source**. A header, a section table, a string table and per-chunk framing cost more than they save when there is nothing to save.

What you get instead: any chunk located without parsing, a truncation order decided in advance, and a checksum tying the brick to the source it came from.

## Same source, same bytes

`faf compile` and the Rust compiler produce the **identical file** from the identical source — byte for byte, against a shared reference fixture. A brick can therefore be compared, cached or deduplicated by hash across tools.

Two hashes matter, and they answer different questions:

| Hash | Over | Use |
|---|---|---|
| Content ID | the content chunks | is this the same context? |
| File digest | every byte | is this the same file? |

Add a comment to your `.faf` and the file digest changes while the Content ID does not — the comment never reaches a chunk.

## Recompile, never migrate

The `.faf` is authoritative. When it changes, compile again; nothing is trapped in an old binary. A brick from an older wire version is rejected on read rather than reinterpreted, and the fix is always the same: recompile.

## Going deeper

- [The tour](https://faf.one/bricks) — the first 32 bytes, annotated
- [The specification](https://github.com/Wolfe-Jam/faf-rust/blob/main/crates/faf-fafb/BINARY-FORMAT.md) — the wire itself

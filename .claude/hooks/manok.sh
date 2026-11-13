#!/bin/bash
# Minden munkamenet elején átmásolja a manok modot a munkamenet mod-mappájába.
SRC=/home/user/claude-modok/manok
[ -d "$SRC" ] || exit 0
SID=$(cat | sed -n 's/.*"session_id" *: *"\([^"]*\)".*/\1/p')
[ -n "$SID" ] || exit 0
D=/root/.claude/dev-mods/$SID
mkdir -p "$D" && rm -rf "$D/manok" && cp -r "$SRC" "$D/manok"
exit 0

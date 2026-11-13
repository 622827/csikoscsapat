#!/bin/bash
# Minden munkamenet elején átmásolja a modokat (manok, task-progress) a munkamenet mod-mappájába.
SRC=/home/user/claude-modok
[ -d "$SRC/manok" ] || exit 0
SID=$(cat | sed -n 's/.*"session_id" *: *"\([^"]*\)".*/\1/p')
[ -n "$SID" ] || exit 0
for M in manok task-progress; do
  mkdir -p "/root/.claude/dev-mods/$SID/$M"
  cp -r "$SRC/$M/." "/root/.claude/dev-mods/$SID/$M/"
done
exit 0

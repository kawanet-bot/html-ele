# Force bash so `set -o pipefail` works in the recipes below.
SHELL := bash
.SHELLFLAGS := -eo pipefail -c

# Documented runtime named exports every consumer shape must expose.
NAMED_EXPORTS := ele ELE HTML EN

# Package-side lifecycle: `pack` builds the tarball (renamed to the fixed
# packed.tgz), `unpack` installs it (--no-save also works in a checkout),
# `test` exercises it. Build `bundled` only after `pack`: npm pack runs
# prepare, whose clean wipes the generated test bundle.
all: pack

pack: clean
	cd ../.. && npm pack --pack-destination builder/pack
	mv *-*.*.*.tgz packed.tgz

bundled:
	$(MAKE) -C .. tests/bundled.mjs

unpack:
	cd ../.. && npm install ./builder/pack/packed.tgz --no-audit --no-fund --no-save

test: test-bundled test-iife

# Resolves through node_modules after `unpack`; inside a checkout the
# package name self-references dist/ instead.
test-bundled:
	cd ../.. && node --test builder/tests/bundled.mjs

# Script-context run of the installed minified bundle: the browser IIFE
# consumer shape, and proof that the tarball ships the file.
test-iife:
	(cat ../../node_modules/html-ele/dist/html-ele.min.js && echo '; for (const k of process.argv.slice(2)) { if (typeof ele[k] !== "function") { console.error("missing browser export:", k); process.exit(1); } console.log("browser export OK:", k); }') | node - $(NAMED_EXPORTS)

clean:
	/bin/rm -f *.tgz

.PHONY: all pack bundled unpack test test-bundled test-iife clean

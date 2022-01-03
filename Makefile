LIB = lib/*.ts
OUTDIR = ./views/scripts

build: 
	npx tailwindcss -i inputs.css -o views/styles/style.css 
	tsc $(LIB) -outDir $(OUTDIR)

test:
	tsc $(LIB) -outDir $(OUTDIR)
	npm test
	

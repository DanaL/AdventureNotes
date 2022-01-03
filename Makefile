buildsite: 
	npx tailwindcss -i inputs.css -o views/styles/style.css 
	tsc tssrc/*.ts -outDir ./views/scripts     

test:
	tsc tssrc/*.ts -outDir ./views/scripts     
	npm test
	

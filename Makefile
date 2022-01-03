buildsite: 
	tsc tssrc/*.ts -outDir ./views/scripts     

test:
	tsc tssrc/*.ts -outDir ./views/scripts     
	npm test
	

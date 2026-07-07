// scripts/utils/render-template.ts
export function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function renderTemplate(template: string, module: string) {
	return template
		.replaceAll("{{MODULE}}", module)
		.replaceAll("{{CLASS}}", capitalize(module));
}

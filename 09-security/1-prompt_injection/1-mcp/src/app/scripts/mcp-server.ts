import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as fs from "fs";
import * as path from "path";

const docsDir = path.join(__dirname, "docs");

function findMarkdownFiles(dir: string, base: string = ""): string[] {
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	const files: string[] = [];

	for (const entry of entries) {
		const relative = base ? `${base}/${entry.name}` : entry.name;

		if (entry.isDirectory()) {
			files.push(...findMarkdownFiles(path.join(dir, entry.name), relative));
		} else if (entry.name.endsWith(".md")) {
			files.push(relative);
		}
	}

	return files;
}

const server = new McpServer({
	name: "codely-docs",
	version: "1.0.0",
});

const docFiles = findMarkdownFiles(docsDir);

for (const file of docFiles) {
	const name = file.replace(/\.md$/, "").replace(/\//g, "-");
	const uri = `docs://${file}`;

	server.registerResource(name, uri, {}, () => ({
		contents: [
			{
				uri,
				mimeType: "text/markdown",
				text: fs.readFileSync(path.join(docsDir, file), "utf-8"),
			},
		],
	}));
}

async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
}

main();

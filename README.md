# OAuth 2.1 MCP Server as a Next.js app on Vercel

This is a Next.js-based application that provides an MCP (Model Context Protocol) server with OAuth 2.1 authentication support. It is intended as a model for building your own MCP server in a Next.js context. It uses the [@vercel/mcp-adapter](https://github.com/vercel/mcp-adapter) to handle the MCP protocol, in order to support both SSE and Streamable HTTP transports.

In addition to being an OAuth server, it also requires the user authenticate. This is currently configured to use Supabase Auth with GitHub as a provider, but you could authenticate users with any provider supported by Supabase (Google, Facebook, Discord, etc.) without breaking the OAuth flow.

## Using with

### [Claude Desktop](https://www.anthropic.com/products/claude-desktop) and [Claude.ai](https://claude.ai)

Claude currently supports only the older SSE transport, so you need to give it a different URL to all the other clients listed here. 

Use the "Connect Apps" button and select "Add Integration". Provide the URL like `https://example.com/mcp/sse` (the `/sse` at the end is important!). Note that Claude Desktop and Web will not accept a `localhost` URL.

### [Cursor](https://cursor.com/)

Edit your `mcp.json` to look like this:

```
{
  "mcpServers": {
      "MyServer": {
        "name": "LlamaIndex MCP Demo",
        "url": "https://example.com/mcp/mcp",
        "transport": "http-stream"
      },
  }
}
```

### [VSCode](https://code.visualstudio.com/)

VSCode currently [doesn't properly evict the client ID](https://github.com/microsoft/vscode/issues/250960), so client registration fails if you accidentally delete the client (the workaround in that issue will resolve it). Otherwise, it works fine. Add this to your settings.json:

```
"mcp": {
    "servers": {
        "My Server": {
            "url": "https://example.com/mcp/mcp"
        }
    }
}
```

### [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector)

Tell Inspector to connect to `https://example.com/mcp/mcp`, with Streamable HTTP transport. You can also use the SSE transport by connecting to `https://example.com/mcp/sse` instead.

## Running the server

```
npm install
prisma generate
npm run dev
```

The very first time you will also need to run `prisma db push` to create the database tables.

### Environment variables

Required environment variables should be in `.env`: (not `.env.local` because Prisma doesn't support it)

```
DATABASE_URL="postgresql://user:pass@server/database"
AUTH_SECRET="any random string"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
REDIS_URL="rediss://user:pass@host:6379"
```

`DATABASE_URL` is required for OAuth authentication to work, this is where sessions etc. live.

`REDIS_URL` is required if you need SSE transport to work (i.e. you want to support Claude Desktop and Web).

## Architecture

If you're using this as a template for your own Next.js app, the important parts are:
* `/src/app/api/oauth/*` - these implement oauth client registration and token exchange
* `/src/app/oauth/authorize/page.tsx` - this implements the oauth consent screen (it's extremely basic right now)
* `/src/mcp/[transport]/route.ts` - this implements the MCP server itself. Your tools, resources, etc. should be defined here.

To handle OAuth your app needs to be able to persist clients, access tokens, etc.. To do this it's using a PostgreSQL database accessed via Prisma. You can swap this for some other database if you want (it will be easiest if it's another Prisma-supported database).

You'll also notice:
* `src/app/auth.ts` - this implements Supabase authentication to your app itself. It's configured to use GitHub as a provider by default, but you can change it to use any other provider supported by Supabase Auth. This is not required for the MCP server to work, but it's a good idea to have it in place for your own app.
* `src/lib/supabase.ts` and `src/lib/supabase-server.ts` - these provide the Supabase client configuration for both client-side and server-side usage.
* `src/middleware.ts` - this handles Supabase session refresh and management.

## Deploying to production

This app only works if deployed to Vercel currently, due to its dependence on the `@vercel/mcp-adapter` package, which in turn is required to support the old SSE transport. We didn't feel like implementing a whole extra protocol just for Claude Desktop.

Deploy as usual. You'll need to add `prisma generate` to your build command, and of course you'll need all the same environment variables as in the development environment.

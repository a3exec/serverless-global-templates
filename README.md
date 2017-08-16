# Serverless Global Templates Plugin

## How to use

### Install from npm

1. Ensure your project has a valid `package.json`.
1. Run `npm install --save serverless-global-templates`.
1. Add `serverless-global-templates` to the list of plugins in `serverless.yml`. The plugins list is an array at the root level (an example `serverless.yml` is included in this project).
1. Setup the templates under the `custom` property, example below.

### Setup

The contents can be inlined, but creating a file for it is recommended.

serverless.yml
``` yaml
custom:
    globalTemplates:
        request:
            application/json: '${file(serverless.template.request)}'
```

serverless.template.request
```
#set( $body = $input.json("$") )

#define( $loop )
{
    #foreach($key in $map.keySet())
        #set( $k = $util.escapeJavaScript($key) )
        #set( $v = $util.escapeJavaScript($map.get($key)).replaceAll("\\\\'", "'") )
        "$k":
          "$v"
          #if( $foreach.hasNext ) , #end
    #end
}
#end

{
    "body": $body,
    "method": "$context.httpMethod",
    "principalId": "$context.authorizer.principalId",
    "stage": "$context.stage",
    "resourcePath" : "$context.resourcePath",
    "cognitoPoolClaims" : {
       "sub": "$context.authorizer.claims.sub"
    },
    #set( $map = $input.params().header )
    "headers": $loop,
    #set( $map = $input.params().querystring )
    "query": $loop,
    #set( $map = $input.params().path )
    "path": $loop,
    #set( $map = $context.identity )
    "identity": $loop,
    #set( $map = $stageVariables )
    "stageVariables": $loop
}
```
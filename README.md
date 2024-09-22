# benlei/json2outputs

[![GitHub Super-Linter](https://github.com/benlei/json2outputs/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/benlei/json2outputs/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/benlei/json2outputs/actions/workflows/check-dist.yml/badge.svg)](https://github.com/benlei/json2outputs/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/benlei/json2outputs/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/benlei/json2outputs/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

Reads in a `json` input (or `file` input) and tries to output its values in dot
notation. Note that if the json/file is a primitive/missing/has errors, nothing
will be output.

For example given the JSON:

```json
{
  "foo": {
    "bar": [1, 2, 3]
  },
  "hello": {
    "world": "abc",
    "example.com/foobar": "bye",
    "yes": true,
    "no": false
  }
}
```

Should output the following:

- `steps.my-id.outputs['foo.bar[0]'] = '1'`
- `steps.my-id.outputs['foo.bar[1]'] = '2'`
- `steps.my-id.outputs['foo.bar[2]'] = '3'`
- `steps.my-id.outputs['hello.world'] = 'abc'`
- `steps.my-id.outputs['hello["example.com/foobar"]'] = 'bye'`
- `steps.my-id.outputs['hello.yes'] = 'true'`
- `steps.my-id.outputs['hello.no'] = 'false'`

## Inputs

<!-- markdownlint-disable MD013 -->

| Input Name | Required | Default | Description                                                      |
| ---------- | -------- | ------- | ---------------------------------------------------------------- |
| `json`     | no       | ''      | The JSON body (string) to parse                                  |
| `file`     | no       | ''      | The JSON file to parse. Ignored if `json` has a non-empty value. |

<!-- markdownlint-enable MD013 -->

## Outputs

Varies depending on inputs.

## Example

```yaml
- name: Test
  id: json
  uses: benlei/json2outputs@v1
  with:
    json: |
      {
        "foo": {
          "bar": [1, 2, 3]
        },
        "hello": {
          "world": "abc",
          "example.com/foobar": "bye",
          "yes": true,
          "no": false
        }
      }

- name: Output value:
  run: |
    echo ${{ steps.json.outputs['hello["example.com/foobar"]'] }}
```

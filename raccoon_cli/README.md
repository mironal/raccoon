
## Raccoon CLI

`bug` というラベルが付いている issue の一覧を取得.

`RACCOON_GITHUB_API_TOKEN` という環境変数に GitHub の API token が登録してある必要があります。

```sh
# RACCOON_GITHUB_API_TOKEN=<your github api token>
# github.com/<repo_owner>/<repo_name>
node raccoon_cli.js --label bug --owner <repo_owner> --repo <repo_name>
```

help を表示

```sh
node raccoon_cli.js -h
# Usage: node raccoon [OPTIONS]
#
# Environment variable: RACCOON_GITHUB_API_TOKEN=<your github api token> is require.
#
#   -l, --label=<label name>  Label name of issue.
#   -o, --owner=<owner name>  Owner of repo. required if set --label option.
#   -r, --repo=<repo name>    Repository name. required if set --label option.
#   -h, --help                display this help.
#
# version: 1.0.0
```

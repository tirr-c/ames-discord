# ames-discord

* **디펜던시 설치**: `yarn`
* **빌드**: `yarn build`
* **실팽**: `yarn start`

## 환경 설정 파일
실행 디렉토리에 있는 `.env`를 읽습니다. 총 세 개의 값이 필요합니다.

* `AMES_DISCORD_TOKEN`: Discord에 연결할 때 쓸 토큰.
* `AMES_ENDPOINT`: Ames GraphQL 엔드포인트.
* `AMES_STATIC`: 정적 애셋이 저장된 곳.

예시 설정은 다음과 같습니다.

```
AMES_DISCORD_TOKEN='foo'
AMES_ENDPOINT='https://ames.tirr.dev/graphql'
AMES_STATIC='https://ames-static.tirr.dev/'
```

---

[MIT](LICENSE)

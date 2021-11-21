# フロントエンドの環境構築及び初期設定に関する実装

## 概要

アプリケーション構成する要素の内、フロントエンド部分を作成していきます。ここで行うこととしては、JavaScriptによってUIの構築を行い、主にユーザーの操作によって都度APIに対しリクエストを発行、そのレスポンスとして受け取ったデータに応じてUIの再レンダリングを行います。  

ここでは主に、フロントエンドを構成するために必要な要素とそのために利用したパッケージ及びそれらの初期設定について触れていきます。  

**※ 補足**  
Single Page application (SPA) を作成する際のGitHubのリポジトリについて、バックエンドのものと同一にする方法と別に作成する方法が考えられますが、今回は同じリポジトリ内で開発を行っています。  
ただ後で気になったことですが、これだとGitログやBranchが混同するので、例えばフロントエンド側での記録のみを確認したいといった場合に邪魔になります。  
バックエンドのサーバーが動作していればAPIリクエストの確認も行うことができ、バックエンド側のコードに依存せずに進めることが可能なので、このような場合リポジトリは分割する方が良さそうだと思いました。  

## 主要使用パッケージ

SPA構築の基本ライブラリとして**React**を使用し、開発環境の構築には**Create React App** (**CRA**)を用いました。その他以下のようなパッケージを使用しています。(括弧内の数字はバージョン)  

- [React](https://reactjs.org) (17.0.2)
- [Create React App](https://create-react-app.dev) (4.0.3)
- [TypeScript](https://www.typescriptlang.org/) (4.2.4) - [静的型付け](#静的型付け)
- [React Router Dom](https://reactrouter.com/web/guides/quick-start) (5.2.0) - [ルーティング](#ルーティング)
- [React Helmet Async](https://github.com/staylor/react-helmet-async) (1.0.9) - [HTMLタグ更新](#htmlタグ更新)
- [Redux](https://redux.js.org) (4.1.0) - [状態管理](#状態管理)
- [React Redux](https://react-redux.js.org) (7.2.4) - 状態管理 (Reactバインディング)
- [Redux Toolkit](https://redux-toolkit.js.org) (1.5.1) - 状態管理 (Redux簡便化ツール)
- [Marerial-UI](https://material-ui.com) (4.11.4) - [UIデザイン](#uiデザイン)
- [Axios](https://github.com/axios/axios) (0.21.1) - [HTTPクライアント](#httpクライアント)
- [React Hook Form](https://react-hook-form.com/) (7.6.5) - [フォーム](#フォーム)生成
- [Yup](https://github.com/jquense/yup) (0.32.9) - [スキーマ構築](#yup)
- [Jest](https://jestjs.io/ja) (27.0.4) - [テスト](#テスト)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) (27.0.4)  - [UIテスト](#react-testing-library)
- [Mock Service Worker](https://mswjs.io) (0.28.2) - [APIモック](#mock-server-worker-msw)
- [markdown-to-jsx](https://github.com/probablyup/markdown-to-jsx) (7.1.3) - [Markdown](#markdown)

## ディレクトリ構成

Reactは初期生成ディレクトリがほぼ存在せず、作成したファイルをどこに格納するかの厳密な規定がありません。そのためディレクトリやファイルの構成は開発者によって様々です。  

そこで、アトミックデザインの考え方や他のリポジトリの構成を参考にしつつ、ここでは以下のような構成を採ります。これは暫定的なもので、何か不都合が発生した場合や改善点を発見した際には適宜構成の変更を行う予定です。  

```bash
src/
├── __tests__/ # テスト実行ファイル
├── components/ # ページの構成要素
├── config/ # 環境変数関連
├── images/ # ロゴなど (ユーザー用は別)
├── layouts/ # ページ全体に係る部品
├── mocks/ # テスト環境構築関連
├── models/ # データ型定義
├── pages/ # ページ(URI)単位
├── store/ # Redux関連
│   ├── slices/ # Redux Action など
│   ├── thunks/ # Async Thunk (APIリクエスト)
├── templates/ # 複数ページで再利用可能なコンポーネント
├── theme/ # CSS (Material-UI テーマ)
├── utils/ # 関数や定数
│   ├── hooks/ # カスタムフック
├── App.tsx # アプリ全体に適用する処理など
├── Routes.tsx # ルーティング
├── index.tsx # ライブラリの設定など
├── react-app-env.d.ts
├── reportWebVitals.ts
└── setupTests.ts
```

その他、新規ディレクトリ名の決定を行うにあたり参考になったのが、VSCode拡張の[Material Icon Theme](https://github.com/PKief/vscode-material-icon-theme)です。これはファイルやディレクトリにその名前に応じてアイコンを表示してくれるツールで、エディターのファイルエクスプローラーの見通しが良くする効果があります。  

これを利用することで、もし命名したディレクトリ名によってアイコンが表示されるなら、それは一般的に利用されている名前であると判断することができます。  

今回の場合も基本的にはアイコンが表示されるような命名になっています。ただし、Redux Storeの関連ディレクトリだけは、アイコンが付与されるような命名ができていません。即ち、`store`、`slices`、`thunks`がこれに当てはまります。色々試行しましたが、適切なディレクトリ名は未だ定まっていません。  

## React

[React](https://reactjs.org)ではコンポーネントとして分割されたJavaScriptのコードを組み合わせることでUIを構築していきます。種別として、クラスを利用したコンポーネントと関数を使ったものが存在しますが、関数型の方が[Hooks (フック)](https://reactjs.org/docs/hooks-intro.html) によって簡単に扱うことができるなどの理由から今では専ら関数型が使用されておりここでもそれに従います。ただ公式サイトではクラス型で説明されている項目も多く、参考にするにはやや困惑することがありました。  
開発環境は[後述のCRA](#create-react-app)を用いることで比較的簡単に整えることができます。  

尚、[Vue](https://v3.ja.vuejs.org)と比較されることが多いですが、Reactの方がJaveScriptの記法に近い使い方ができる他、**TypeScript** [(後述)](#typescript)を扱いやすいということなどからこちらを使用しています。  

## Create React App

[Create React App](https://create-react-app.dev)を利用することで、依存パッケージの導入から設定まで面倒な操作も行うことなくReactを使用したプロジェクトを始めることができます。これには**webpack**や**Babel**、**ESLint**なども含まれています。  

尚、CRAの代わりとして、[Next.js](https://nextjs.org)を使用するという選択肢も考慮しています。しかし、SPAの作成には[こちらが推奨されているような記述がある](https://reactjs.org/docs/create-a-new-react-app.html#recommended-toolchains)ことや、CRAの方は経験があり手早く開発できそうだったこと、また後にNext.jsを使用することになってもCRAの経験やコードが活用できそうだったことなどを勘案の上CRAを採用しました。  

### テンプレート

CRAを導入するにあたって、同時に[テンプレートを選択](https://create-react-app.dev/docs/getting-started/#selecting-a-template)することができます。これにより必要なパッケージを個別にインストールする手間が省けます。今回はTypeScriptで開発するためのテンプレートを使用するため、実行するコマンドは以下のようになります。  

```bash
# `frontend`部は任意のプロジェクト名
npx create-react-app frontend --template typescript
```

尚、この際[後述](#redux)の**Redux**も同時にインストールするテンプレートも存在していましたが、一部のパッケージのバージョンが最新でなかったことから別途インストールする方法を採っています。  

> 参考： [Getting Started | Create React App](https://create-react-app.dev/docs/getting-started/#creating-a-typescript-app)  

### `tsconfig.json`

CRAでは設定用のファイル`tsconfig.json`が初めから作成されています。ここに一つ追加の設定として`baseUrl`を加えておきます。  

```ts :tsconfig.json
{
  "compilerOptions": {
   ...

    "baseUrl": "src"
  },
  "include": ["src"]
}
```

これによって、`import`を行う際に、現在のファイルからの相対パスではなく、`baseUrl`で指定したパスからの相対パスを利用することができます。  

例えば、`import`を行うファイルの3階層上に目的のコンポーネントが存在する場合、`baseUrl`を指定しない場合と指定した場合の違いは以下のようになります。  

```ts
// `baseUrl`指定なし (アプリケーション上でのファイルの位置はこれだけでは不明)
import Header from '../../../layouts/Header';

// `baseUrl`指定あり (ファイルは`src/layouts/Header.ts`に存在)
import Header from 'layouts/Header';
```

このように、`import`するファイルがかなり上の階層に位置する場合にはファイルの位置判断が困難になるので、そのような場合には特に効果的です。  

## 静的型付け

静的型付けを導入することで、変数や関数にコメントなど注釈を付け加えることなくその振る舞いを示すことができ、コードの可読性を向上させることが期待できます。またそこで定義した使用法から外れた予期しないコードの利用に対しては、IDEやエディター (ここでは[VSCode](https://code.visualstudio.com)) がエラーを表示させ、ここから発生するバグを未然に防ぐことが可能です。  
例えば動的型付けの場合、引数が必要にもかかわらず指定せずに関数を利用したとしても、また誤った引数に指定したとしても、実行するまでエラーは表示されません。一方、静的型付けの場合はその時点でエラーの内容が示されます。  

また関数使用時に利用できるプロパティやメソッドの候補を表示する補完機能を利用することも可能で、入力ミスをなくし効率の良いコーディングに繋がります。特に各種ライブラリの使用時にその効力を実感することになります。  

JaveScriptは動的型付け言語なので、静的型付けを行えるようにするためにTypeScriptを導入します。  

### TypeScript

JaveScriptで静的型付けを導入する他の方法も存在するようですが、[TypeScript](https://www.typescriptlang.org/)がデファクトスタンダードと言える選択肢となっています。利点として、導入や利用が容易であることが挙げられます。例えば今回利用しているCRAでは、コンパイラなどの設定不要で使用を開始することが可能で、型として`any`を指定することでJavaScriptと同じように利用できるので少しずつTypeScriptの色に染めて行くことができます。また、VSCodeにおいては拡張機能を追加することなく補完機能が利用でき、変数や関数にマウスオーバーすることで型情報を表示させることができます。  
このような事情から特段の理由がない限りJavaScriptではなく、TypeScriptを利用することが望ましいと考えています。  

注意点としては、ライブラリ使用時、型定義ファイルが提供されていない場合は利用することができないことです。しかしTypeScriptの利用はだいぶ一般的になっており、基本的に型定義ファイルを利用することができるようになっています。各パッケージのドキュメントにもTypeScriptでの利用を想定した項目が存在するものが多くを占めます。  

## ルーティング

SPAにおいてはリンクによるページ遷移は行いません。SPAでこれを表現してUIの表示を切り替えるためにルーティングの設定が必要です。Reactでは一般的に**React Router Dom**を利用することでこれを実現します。  

### React Router Dom

初めに[React Router](https://reactrouter.com/web/guides/quick-start)のインストールから行います。`react-router`というパッケージも存在しますが、Webアプリケーションの場合以下の注釈があるように、必要なものは`react-router-dom`です。  

> Note: This package provides the core routing functionality for React Router, but you might not want to install it directly. If you are writing an application that will run in the browser, you should instead install react-router-dom.  
> [ReactTraining/react-router - GitHub](https://github.com/ReactTraining/react-router/tree/master/packages/react-router#installation)

同時に型定義ファイルも忘れずインストールします。  

```bash
yarn add react-router-dom @types/react-router-dom
```

#### ルーティング設定

最も基本的な用法は`BrowserRouter`の中に`Route`を内包した`Swich`コンポーネントを配置することです。ここでは`App.tsx`に`BrowserRouter`を作成し、実際のルーティングは`Route.tsx`というファイルを作成してそこで設定を行っています。  

```tsx :src/Route.tsx
import React from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
// 以下のコンポーネントは作成済みと仮定
import Home from './pages';
import NotFound from './pages/NotFound';

const Routes: React.FC = () => {
  return (
    <Switch>
     {/* `exact`を付与しないと`/`以外のパスも含まれる */}
      <Route exact path='/' component={Home} />
     {/* 設定した全てのパスに該当しないアクセスを捕捉 */}
      <Route path='*' component={NotFound} />
    </Switch>
  );
};
```

ルートパス`/`にアクセスした場合は`Home`コンポーネントをレンダリングし、それ以外のアクセスは`404`エラーとして`NotFound`を表示するというルーティングを行いました。これらのコンポーネントは後に作成を行います。  

次にこのルーティングファイル`Route.ts`を`App.tsx`側で読み込みます。尚、ドキュメントに従って`import`の際に`Router`という別名を付けています。  

```tsx :src/App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';

const App: React.FC = () => {
  return (
    <Router>
      <Routes />
    </Router>
  );
};
```

#### リンク作成

React Routerで定義したルートへアクセスするためののリンクには、通常の`a`タグではなく`Link`コンポーネントを使って行います。  

```tsx
<Link to='/'>Home</Link>
```

[後述の](#material-ui)Material-UIと組み合わせて利用する場合には、コンポーネントのプロパティにReact Routerの`Link`を指定します。これによってスタイリングを行いつつルーティングも実現できます。尚、これはリンクだけでなくボタンにも適用可能です。  

```tsx
import { Link as RouterLink } from 'react-router-dom';
import { Button, Link } from '@material-ui/core';

<Button component={RouterLink} to='/'>
  戻る
</Button>

<Link component={RouterLink} to='/register'>
  登録する
<Link>
```

> 参考： [Routing libraries](https://material-ui.com/guides/composition/#routing-libraries) | Composition - Material-UI  

#### クエリパラメータ取得

クエリパラメータの取得にはやや準備が必要です。すぐに利用できるように、[公式ドキュメント](https://reactrouter.com/web/example/query-parameters)に従って独自Hooks (カスタムフック) を作成します。まず`utils`ディレクトリ及びその配下に`hooks`ディレクトリを作成し、そこに以下のような`useQuery.ts`ファイルを作成します。  

```ts :src/utils/hooks/useQuery.ts
import { useLocation } from 'react-router-dom';

// クエリパラメータ用カスタムフック
export const useQuery = () => new URLSearchParams(useLocation().search);

export default useQuery;
```

クエリパラメータを取得するには`get`メソッドを利用し、もし取得できなかった場合には`null`が返却されます。`string`型として扱うなら`null`のときは空文字として扱う方法もあります。  

```tsx
import useQuery from 'utils/hooks/useQuery';

const query = useQuery();

const token = query.get('token') || '';
```

> 参考： [React Router: Declarative Routing for React.js](https://reactrouter.com/web/example/query-parameters)  

## HTMLタグ更新

さて、Routerによってページ遷移を実現しましたが、ここでHTMLの`title`タグなど、`head`タグ内の情報も同時に変化させたいところです。そのような場合に利用できるのが[React Helmet](https://github.com/nfl/react-helmet)です。  
しかしこれは場合によって[警告が出てしまう](https://github.com/nfl/react-helmet/issues/548)ので、代わりに[React Helmet Async](https://github.com/staylor/react-helmet-async)を使用することにします。これはReact Helmetのフォークリポジトリで、基本的な用法は同じです。  

### React Helmet Async

実際に使用して、`title`タグを挿入する例を見てみます。  

まずはインストールを行いますが、この際に型定義ファイルも同時に取得します。  

```bash
yarn add react-helmet-async @types/react-helmet
```

使用する前に、準備として上位のコンポーネント (ここでは`src/index.tsx`) の中で`HelmetProvider`を用いたコンポーネントの囲い込みが必要です。  

```tsx src/index.ts
import { HelmetProvider } from 'react-helmet-async';
...
<HelmetProvider>
  <App />
</HelmetProvider>
```

次に、HTMLタグを変化させるコンポーネントで`Helmet`を使用し、その中でHTMLタグを定義します。  

```tsx :src/pages/index.tsx
import { Helmet } from 'react-helmet-async';

const Home: React.FC = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>{APP_NAME}</title>
      </Helmet>
      // some components
    </React.Fragment>
  );
};
```

以上で、コンポーネントをレンダリングする際に同時に`title`タグも変更されるようにすることができました。  

> 参考： [devias-io/material-kit-react](https://github.com/devias-io/material-kit-react/tree/main/src/pages) - GitHub  

## 状態管理

状態に応じてUIを表示するためアプリケーション上でこれらを管理する必要があります。ただ問題はその状態が多くのコンポーネントに渡って影響を与えるとき特に管理が複雑化することです。これを解決すべく通常は別途ライブラリを導入します。一般的に利用されるのは**Redux**で、今回もそれを利用します。  

**※ 補足**  
ここでReduxを使わないという選択肢も考えられます。特にReactで提供される [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext)や[useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer)を代替手段としても目的を達成することができ、この場合追加パッケージをインストールする必要がなくなるという利点があります。しかし、これはReduxの完全な代替になるものではありません。特にReduxを利用する目的の一つとしてブラウザ拡張機能の[Redux DevTools](https://github.com/zalmoxisus/redux-devtools-extension)の存在があります。  
これは現在の状態の表示や状態を変化させるアクション、その時変化した状態の差分などの情報を提供してくれるツールで、状態を把握しデバッグを行う際に重宝します。これが利用できることが重要なので、基本的にはReduxを利用するスタイルを採用しています。  

### Redux

[Redux](https://redux.js.org)は、前述のようにSPAとして不可欠な機能を提供し事実上Reactとセットで利用することも多いですが、コード量が多く複雑化しやすいという問題を抱えていました。しかし公式に提供されている[Redux Toolkit](https://redux-toolkit.js.org) (RTK) を併用することで簡潔な記述が可能で容易に状態管理を利用できるようになります。  

> 参考： [Getting Started with Redux | Redux](https://redux.js.org/introduction/getting-started#redux-toolkit)  

### Redux Toolkit

は冗長かつ複雑になりがちであったReduxを簡単に扱えるようにするためにRedux公式として提供されているツールです。これ自体にReduxを内包しているため別途`redux`はインストールする必要はありませんが、別途追加のパッケージ ([React Redux](https://react-redux.js.org)) が必要になります。これは、Reduxが作成及び管理している状態 (**Redux Store**) をReactで利用できるようにするために利用されます。  

RTKはTypeScriptで構成されており、型定義コードが組み込まれています。この場合には型定義ファイルをインストールすることなくTypeScriptで利用することができます。一方、React Reduxには型定義ファイルが用意されているのでこれを同時にインストールします。  

```bash
yarn add @reduxjs/toolkit react-redux @types/react-redux
```

**※ 補足**  
その他のライブラリとして、非同期処理を扱う場合に、[Redux Thunk](https://github.com/reduxjs/redux-thunk)や[Redux-Saga](https://redux-saga.js.org)などを利用することになると思いますが、**Redux Thunk**が既に内包されているので追加でインストールする必要はありません。  
他にもいくつかのライブラリが含まれており、下のリンクから確認ができます。  

> 参考： [What's Included](https://redux-toolkit.js.org/introduction/getting-started#whats-included)  

#### Storeの構成

グローバルな状態としての**Redux Store**を作成し、利用できるようにするため設定を行っていきます。  

まず初めに、Storeに関するファイルを配置するためのディレクトリとして`src/store`を作成しておきます。ディレクトリ構成については[先述のとおり](#ディレクトリ構成)です。  

次に`index.ts`を作成して、ここで`store`の作成を行います。`configureStore`を利用し、プロパティに`reducer`を指定することで`store`を作成することができます。これは単なる状態としての値を持つものではなく、状態を参照するための`getState`メソッドやその状態を更新するための`dispatch`メソッドが含まれているものになります。  

```ts :src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({ reducer: {} });

export default store;
```

`reducer`の指定は個別に行う方法と、作成した各`reducer`の集合である`rootReducer`というものを定義してからこれを渡す方法がありますが、コードの重複を避けるため後者を採用します。この場合、上記の`store`作成コードは以下のようになります。  

```ts : src/store/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';

export const rootReducer = combineReducers({
  // ここに`reducer`を追加する
});

const store = configureStore({ reducer: rootReducer });

export default store;
```

作成した`store`をアプリケーション全体で利用できるようにするため、コンポーネントのトップレベルに`<Provider>`を配置し、プロパティとして`store`を渡します。  

```tsx :src/index.ts
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
```

`rootReducer`にはまだ何も登録されていないので何らかの状態を参照や更新することはできませんが、状態管理のための準備としてはこれで完了です。  

> 参考：  
> [Quick Start | Redux Toolkit](https://redux-toolkit.js.org/tutorials/quick-start)  

#### Storeの構成 (TypeScriptの場合)

TypeScriptでも上記と設定自体は同じです。`configureStore`などメソッドは返り値の型が決まっているので、変数としての`store`は型推論によって型が決定され、明示的な型を指定する必要はありません。  

一方、状態の参照時に利用される`userSeletor`Hooks及び更新時に利用される`useDispatch`Hooksについては、型を与える必要があります。[公式ドキュメントに従って](https://redux-toolkit.js.org/tutorials/typescript#define-root-state-and-dispatch-types)、これらHooksで使用される型の定義を初めに行います。  

```ts :src/store/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';

export const rootReducer = combineReducers({
  auth: authSlice.reducer,
});

const store = configureStore({ reducer: rootReducer });

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export default store;
```

次にこれらの型を使用して独自のHooksを作成しますが、[公式ドキュメントの場合](https://redux-toolkit.js.org/tutorials/typescript#define-typed-hooks)とは異なり、作成するHooks毎にファイルを分割し、これらファイルを`src/utils/hooks`ディレクトリを作成してその配下に置く方法を採ります。  

まず先程定義した`AppDispatch`を`import`して、`useDispatch`に型を指定して新たなHooks `useAppDispatch`を作成します。  

```ts :src/utils/hooks/useAppDispatch.ts
import { useDispatch } from 'react-redux';
import type { AppDispatch } from 'store';

// `useDispatch`使用時、'middleware'(Redux Thunkを含む)を適用する
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default useAppDispatch;
```

これによって、すぐに何か効果を実感するものではありませんが、ドキュメントには、必要になったときに`AppDispatch`を`import`するのを忘れることを防ぐと述べられています。ここで必要なときとは例えば非同期処理を行う場合などです。  

次に`RootState`を`import`して、`useSelector`に型を指定して新たなHooks `useAppSelector`を作成します。  

```ts :src/utils/hooks/useAppDispatch.ts
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from 'store';

// `useSelector`使用時、`(state: RootState)`を毎回入力する必要をなくす
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useAppSelector;
```

これによって、`useSelector`を使用する場合に`RootState`を毎回セットで`import`する必要がなくなります。  

```tsx
// Before
import { useSelector } from 'react-redux';
import { RootState } from 'store';

const { user } = useSelector((state: RootState) => state.auth);

// After
import useAppSelector from 'utils/hooks/useAppDispatch';

const { user } = useAppSelector((state) => state.auth);
```

今回は新たなHooksを複数のファイルに分割して作成しましたが、このように一つの機能に一つのファイルを割り当てるという方法もよく見られます。そしてこのような分割を行った場合にモジュールの**再export**を利用することで、モジュール`import`の際に簡潔に記述できる利点があります。  

これを行うために、作成したファイルと同じ階層の`utils/hooks`ディレクトリ配下に`index.ts`を作成し、その中で以下のように`export`文を記述します。  

```ts :src/utils/hooks/index.ts
export * from './useAppDipatch';
export * from './useAppSelector';
```

これは`from`で指定したファイルで`export`されているモジュールを**再度**全て`export`するという記述になります。  

これによって、先程別のファイルに作成したカスタムフックを、恰もこの`index.ts`に存在しているかのように`import`することができます。  

```tsx
import { useAppDispatch, useAppSelector } from 'utils/hooks';
```

ファイルごとに役割を分離しつつ`import`文が冗長になることを防ぐことができるので、できる限り採用して行きたい手法です。  

## UIデザイン

CSSスタイリングはデザイン用のフレームワークを利用することで比較的容易に行うことができます。この選択肢についても、有名なBootstrapや最近採用例が増えてきているように感じるTailwind CSSなど様々考えられますが、今回は[Marerial-UI](https://material-ui.com) (MUI)を採用しています。  

### Material-UI

MUIは`Class`名を与えてスタイリングするのではなく、役割に応じたコンポーネントが用意されておりそれらを`import`しつつUIを作り上げていく方式になります。都度CSSをカスタマイズして利用することも、組み合わせたものを新たなコンポーネントとしてモジュール化することも可能です。どちらにしても、このコンポーネントベースのスタイリングはコードの再利用が行いやすいという利点があります。  

MUIをUIフレームワークとして利用することを決定した主な理由としては、Reactとの組み合わせで用いられること実装例が多く参考としての情報収集が行いやすいことや、公式の実装例も豊富ですぐにコードを取り入れて実装できること、またそのカスタマイズも簡単に行えることなどがあります。またある程度経験済みだったため導入までの障壁が低く抑えられると考え採用に至りました。  

MUIにはパッケージが複数に分割して存在しており必要に応じてインストールが必要です。以下では主要機能用、アイコン用、追加機能用のパッケージをそれぞれインストールしています。  

```bash
yarn add @material-ui/core @material-ui/icons @material-ui/lab
```

#### テーマのカスタマイズ

MUIのスタイリングは利用する際にそのモジュール毎に変更を加えることが可能です。しかし、毎回同一のスタイルを割り当てる場合もあるでしょう。そのような時にはテーマをカスタマイズします。このテーマにはメイン及びサブの配色やフォントサイズなどが含まれます。詳細は[公式ドキュメント](https://material-ui.com/customization/theming)を参照します。  

ここでは主に配色を司る[Palette](https://material-ui.com/customization/palette)のデフォルト設定を変更します。そのためにまずテーマ管理用のディレクトリとして、`src/theme`を新たに作成し、配下に`index.ts`ファイルを加え、`createTheme`によってテーマを作成します。  

```ts :src/theme/index.ts
import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {},
});

export default theme;
```

この`createTheme`のプロパティとして`palette`を追加することでカスタマイズされたテーマを作成することができます。同じファイル内にそのまま記述する方法もありますが、`palette.ts`という別ファイルを用意することにします。関数内での記述ではない場合そのままでは補完機能が働かなくなりますが、TypeScriptの型を指定することで問題なく動作します。  

具体的にはこの`palette`は以下のように作成しています。  

```ts :src/theme/palette.ts
import { PaletteOptions } from '@material-ui/core/styles/createPalette';

const palette: PaletteOptions = {
  primary: {
    light: '#e0fffa',
    main: '#40cbb5',
    contrastText: '#fff',
  },
  secondary: {
    main: '#ffa133',
    contrastText: '#fff',
  },
  // light, dark値の算出 0に近いほど main値に近付く (0-1)
  tonalOffset: 0.025,
};

export default palette;
```

`createTheme`の`palette`プロパティには`PaletteOptions`という型が与えられているのでそれを`import`して付与しています。尚、使用されている型が不明な場合でも`createTheme`の補完機能を利用することで判断可能です。(VSCodeでは、`palette`プロパティにマウスオーバーします。)  

`primary`はメインの配色に関するプロパティで、その内`main`は最も基本的に使用される配色、`light`は明るめの配色です。逆に暗めは`dark`ですが、どちらも指定しなかった場合は自動で計算された色が決定されます。その時の基準として利用されるのが`tonalOffset`プロパティで、0〜1の範囲で値を設定し、1に近いほど`light`ならより明るくなり`dark`はその逆となります。  

これによって`index.ts`を以下のように修正します。  

```ts :src/theme/index.ts
import { createTheme } from '@material-ui/core/styles';
import palette from './palette';

const theme = createTheme({
  palette,
});

export default theme;
```

プロパティ名と変数名が同一なのでここで`palette: palette`のようにする必要はありません。  

作成したテーマを適用させるには`ThemeProvider`に`theme`を渡すことが必要ですが、これは`src/index.tsx`に記述します。以下のように`theme`プロパティとして指定します。  

```tsx :src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from './theme';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
```

ここで同時に`CssBaseline`というものを導入しています。これは異なるブラウザ環境の差異を解消する効果がある他、アプリケーション全体に適用させる[グローバルCSSをテーマとしてカスタマイズする](https://material-ui.com/customization/globals/#global-css)際にもなります。これまでのカスタマイズはMUIコンポーネントが対象だったのに対し、こちらは`a`や`li`などのHTMLタグに対するものです。  

以上でMUIの基本的な設定は完了です。必要に応じて`createTheme`のプロパティとしてのモジュールを`theme`ディレクトリに追加していきます。  

#### バンドルサイズ削減

MUIの一つの問題としてバンドルサイズが大きくなることが挙げられ、結果として開発環境の動作が重くなり、特に`icons`パッケージを使用する場合に顕著になります。これは`import`文の記述法によって左右されます。通常公式ドキュメントのコード例として掲載されているのは一つ目の方法です。  

```tsx
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
```

もう一つの記述法としては以下のようになり、こちらの方が速度は低下します。  

```tsx
import { Button, TextField } from '@material-ui/core';
```

公式ドキュメントによれば、二つ目の記述法を採用することでコードの重複が可読性を向上させるとしています。また**Babel**プラグインを導入することで速度の問題も解決することができます。  

>This option provides the best User Experience and Developer Experience:  
>
> - UX: The Babel plugin enables top level tree-shaking even if your bundler doesn't support it.
> - DX: The Babel plugin makes startup time in dev mode as fast as Option 1.
> - DX: This syntax reduces the duplication of code, requiring only a single import for multiple modules. Overall, the code is easier to read, and you are less likely to make a mistake when importing a new module.
>
> [Minimizing Bundle Size - Material-UI](https://material-ui.com/guides/minimizing-bundle-size/#option-2)  

このような利点があるにも関わらず、MUIが一つ目の構文をコード例として基本的に用いている理由としてはゼロコンフィグを実現するためのようです。  

ここでは、必要な設定を行って二つ目の記述法を採用することにします。手順としては[ドキュメントの内容](https://material-ui.com/guides/minimizing-bundle-size/#option-2)そのままです。  

まずは以下のパッケージをインストールします。  

```bash
yarn add -D babel-plugin-import react-app-rewired customize-cra
```

次に`.babelrc.js`ファイルを以下の内容でルートディレクトリに作成します。  

```js :babelrc.js
const plugins = [
  [
    'babel-plugin-import',
    {
      libraryName: '@material-ui/core',
      // Use "'libraryDirectory': ''," if your bundler does not support ES modules
      libraryDirectory: 'esm',
      camel2DashComponentName: false,
    },
    'core',
  ],
  [
    'babel-plugin-import',
    {
      libraryName: '@material-ui/icons',
      // Use "'libraryDirectory': ''," if your bundler does not support ES modules
      libraryDirectory: 'esm',
      camel2DashComponentName: false,
    },
    'icons',
  ],
];

module.exports = { plugins };
```

そして次に、以下の`config-overrides.js`ファイルをルートディレクトリに作成します。  

```js :config-overrides.js
/* eslint-disable react-hooks/rules-of-hooks */
/* config-overrides.js */
const { useBabelRc, override } = require('customize-cra');

module.exports = override(useBabelRc());
```

最後に、`package.json`の`start`コマンドを以下のように修正します。  

```json :package.json
  "scripts": {
-  "start": "react-scripts start"
+  "start": "react-app-rewired start"
  }
```

CRAではコンフィグを直接変更することができないためこのようなアプローチを取るわけですね。  

以上で、MUIで初めに行うべき設定が完了しました。  

## HTTPクライアント

SPAにおいては、動的なデータの管理はバックエンドが担っています。即ち、ユーザーによるアクションの際など、必要になったタイミングでデータベースからデータを取得することが要されます。そのリクエストを行うためHTTPクライアントを用意しなければなりません。今回の場合、**Axios**がその役割を果たしています。  

### Axios

[Fetch API](https://developer.mozilla.org/ja/docs/Web/API/Fetch_API)であれば追加パッケージ不要で使用することができますが、代わりに[Axios](https://github.com/axios/axios)を利用することで、さらに多機能かつ複雑な設定なしで容易に導入することができるのでこれを導入しています。  
例えば、CSRFガード施されているAPIへアクセスする際に、Cookieに保存されたCSRFトークンをHTTPヘッダーに付与する必要がありますが、これをAxiosでは自動で行ってくれます。  

それでは初めにインストールから行います。尚、[型定義は内包されている](https://github.com/axios/axios#typescript)ので追加のパッケージは不要です。  

```bash
yarn add axios
```

#### Axios Instance

APIリクエストを行う際、バックエンドのURLを指定する必要がありますが、この内ルートパスまでは同一です。よって、入力の手間を省くと共にミスを防ぐ目的から、ベースとなるURLを指定します。またバックエンドはフロントエンドとは別オリジンとなるのでCORS用の設定が必要となります。`Axios Instance`を作成することでこれらを同時に解決することができます。  

作成には`axios`の`create`メソッドを使用し、`baseURL`にAPIサーバーのURLを指定します。次に`withCredentials`オプションを`true`にして異なるオリジン間でのリクエストを有効にします。  

```ts
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost',
    withCredentials: true,
});
```

例えばGETリクエストを行う場合には、`axios.get()` の代わりに`apiClient.get()` を使用することで、設定したオプションが機能した状態でのリクエストとなります。  

> 参考： [The Axios Instance | Axios Docs](https://axios-http.com/docs/instance/)

## フォーム

ユーザーから何らかの入力値を受け取ってAPIリクエストを行う場合、フォームの生成が必要になります。基本的な機能として、入力値を監視し、都度バリデーションを実施して決められた入力値に沿わないものはリクエストを拒否しつつ、ユーザーに対し正しい入力を促すエラーメッセージを表示することが挙げられます。  

これらを実装するとなると、特にバリデーションの構築は少々骨が折れます。そこで、フォーム生成ライブラリの **React Hook Form** 及び バリデーション用スキーマ構築ライブラリの**Yup**を併用することでこの実装の問題を解決しています。  

### React Hook Form

[React Hook Form](https://react-hook-form.com) は、フォームの主要機能である値の監視、バリデーション、Submit時の動作、またエラー情報などを担います。特に複雑な設定不要で使用を始めることができますが、デフォルトのバリデーションはやや機能が控えめで、複雑な設定をするには大変そうです。  

一方ドキュメントには、[別のバリデーション用ライブラリと併用する場合の実装例](https://react-hook-form.com/get-started#SchemaValidation)が載せられています。今回利用しているのはこちらの方法で、いくつかの選択肢の内、**Yup**を採用しました。  

併用するためには、これらパッケージの他、`@hookform/resolvers`をインストールします。  

```bash
yarn add react-hook-form yup @hookform/resolvers
```

#### Yup

[Yup](https://github.com/jquense/yup)ではバリデーション実施のためのスキーマを構築します。これは入力する項目に対し制限を設けるものです。例えば、フォーム入力項目毎に、`string`型制限、入力必須項目、文字数制限などを直感的に指定することができます。  

```tsx
const schema = yup.object().shape({
  email: yup.string().email().required().min(8).max(20),
});
```

#### Matarial-UIの併用

React Hook Form 及び Yupは、フォームの機能を提供するものでした。見た目を整えるためには別途スタイリングあ必要です。今回はMUIを用いているのでこれらを組み合わせた場合の実装を行います。  

ここでテンプレートを[MUIのページ上](https://material-ui.com/getting-started/templates)から取得します。ここでは"Sign In"テンプレートをベースにログインフォームの実装を行います。ディレクトリは`src/pages/auth`を用意してそこに`SignIn.tsx`を作成します。  

まずは、入力項目の型を定義します。([TypeScriptの例](https://react-hook-form.com/get-started#TypeScript))  

```tsx :src/pages/auth/SignIn.tsx
type FormData = {
  email: string;
  password: string;
  remember?: string;
};
```

上記では、メールアドレスとパスワードでログインする場合の入力項目です。`remember`はログイン状態を維持するか決定するオプションで、フォームのチェックボックスにチェックを入れると`"on"`が送信され、外すと何も送信されません。よって、`string | undefined`ですが、それを`?`を使用して表しています。  

次に、Yupによるスキーマを構築します。ここでバリデーションに利用できるAPIは[こちらのGitHubのページ](https://github.com/jquense/yup)から確認できます。  

```tsx :src/pages/auth/SignIn.tsx
import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required().min(8).max(20),
});
```

文字列制限や入力必須、最大最小文字数などを定めています。この内`email`というのは、メールアドレスの形式になっているかを正規表現によって検査します。  

```ts
let rEmail = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
```

> [https://github.com/jquense/yup/blob/master/src/string.ts](https://github.com/jquense/yup/blob/master/src/string.ts)

これらを基にフォームの機能を作成します。(本稿の要点以外は省略)  

```tsx :src/pages/auth/SignIn.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField, Checkbox, FormControlLabel } from '@material-ui/core';

const SignIn: React.FC = () => {
  const {
    register, // 入力項目の登録
    handleSubmit, // Submit時の挙動
    formState: { errors }, // エラー情報 (メッセージなど) を含む`state`
  } = useForm<FormData>({
    mode: 'onChange', // バリデーション判定タイミング (`onChange`は入力値の変化毎)
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // 入力値を基にAPIリクエスト
  };

  return (
    ...
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          id='email'
          label='Email Address'
          {...register('email')} // フォーム機能の付与
          helperText={errors?.email?.message}
          error={!!errors?.email}
        />
        <TextField
          id='password'
          label='Password'
          type='password'
          {...register('password')}
          helperText={errors?.password?.message || '8-20 characters'}
          error={!!errors?.password}
        />
        <FormControlLabel
          control={ <Checkbox {...register('remember')} value='on' /> }
          label='Remember me'
        />
        <Button type='submit'>{'Sign in'}</Button>
      </form>
    ...
  )
}
```

`useForm`によって生成された`register`からそれぞれのそれぞれの項目を取り出し、MUIの`TextField`のプロパティとして割り当てます。これには`name`属性などが含まれています。  

これ以外は通常のMUIのコンポーネントをそのまま利用することができます。もしバリデーションの結果エラーが発生した場合には`errors`状態にその情報が格納されるので、それに応じて`error`プロパティを`true`にする (入力枠をエラー状態を示す赤色にする) と共に、`helperText`を使用してエラーメッセージを表示します。  

尚、上記のパスワードフィールドでは、入力開始時などエラーが存在しない場合には別の`helperText` ("8-20 characters") を表示しています。  

以上のように、React Hook Form、Yup、MUIを組み合わせて利用することにそれほど複雑なことはありませんでした。基本形を完成することができれば、その後はバリデーションの設計をより堅牢なものにしたり、UIを整えたりしていきます。  

## テスト

実装の初期の段階では動作画面を確認しながら行うことで記述したコードの理解促進に寄与することも考えられますが、ある程度実装が進んでいくとコードが膨大になり、機能の追加や修正の度に同じような確認をすることは効率が悪く困難になります。そこでテストコードを導入することで効率の向上を図り、また想定外のエラーを事前に発見できる環境整備を目指します。  

CRAにおいては、テストを導入するための環境が既に整っております。即ち、テスト実行用パッケージである**Jest**がインストール済みであり、そのデフォルトの設定も用意された状態となっています。また、UIテストを実行する際に有用な**React Testing Library**も同梱されている他、全てのテスト実行前に作用する`setupTests.ts`も準備されており、すぐにテストを開始することができます。  

> 参考： [Running Tests | Create React App](https://create-react-app.dev/docs/running-tests)  

### Jest

[Jest](https://jestjs.io)はJavaScript用のテスティングフレームワークで、テストに必要な機能があらかた網羅されています。テストが実行される環境の用意 (JSDOM) から、テストに使用するメソッドの提供、テストの実行などはJestが担います。  

CRAを利用している場合、`yarn test`を実行するだけでJestによるテストが走ります。サンプル用のテストファイル`App.test.tsx`も付属しているので、自身でテストを書いていない状態から試行することができます。  

尚、このファイルがテスト実行用であることはそのファイル名から判断されています。即ち、末尾に`.test.ts (tsx)`又は`.spec.ts (tsx)`が付いているものがその対象となります。若しくは、`__test__`ディレクトリのファイルであれば、通常の`ts`又は`tsx`ファイルがテストファイルであると認められます。  

> 参考：  
> [Filename Conventions](https://create-react-app.dev/docs/running-tests#filename-conventions) - Running Tests | Create React App  
> [testRegex](https://jestjs.io/docs/configuration#testregex-string--arraystring) - Configuring Jest · Jest  

#### Jest Config

通常Jestではテストの際に適用させる設定を`jest.config.ts`の中での中で行いますが、CRAではデフォルトのコンフィグが内蔵させており`jest.config.ts`によって設定を変更することができません。代わりに、`package.json`に`jest`の項目を設け、ここに設定を記述することで対応します。(ただしサポートされているコンフィグに制限あり)  

> 参考： [Configuration](https://create-react-app.dev/docs/running-tests/#configuration) - Running Tests | Create React App  

#### Jest CLI

先述のとおり、CRAにおいては`yarn test`コマンドによってJestを実行しますが、この実体は`package.json`の`scripts`の`test`に記述されています。  

```json :src/package.json
{
  "scripts": {
    "test": "react-scripts test",
  }
}
```

内部ではJestが利用されているので同等のコマンドオプションが利用できます。利用可能なオプションは、[Jestのドキュメント](https://jestjs.io/docs/cli)の他、`--help`オプションによっても確認可能です。  

常に利用するオプションについては上記の`package.json`の`script`に記述することで、`yarn test`コマンドの挙動を変更することができます。  

```json :src/package.json
{
  "scripts": {
    "test": "react-scripts test --coverage --verbose",
  }
}
```

上のオプションは`package.json`に記述はしていませんが、今回よく利用したオプションです。`--coverage`は[後述のカバレッジ](#カバレッジ)を表示するため、`--verbose`はテスト結果を各テストケース毎 (デフォルトはテストファイル毎) に表示するために用います。  

```bash
# verboseオプションなし
PASS  src/__tests__/store/auth/thunks/resetPassword.test.ts

# verboseオプションあり
PASS  src/__tests__/store/auth/thunks/resetPassword.test.ts
  Thunk for resetting the password
    Rejected
      ✓ should be an error with a set of email and token (25 ms)
      ✓ should receive an error if the token unmatchs (24 ms)
      ✓ should be authenticated with a original password (28 ms)
      ✓ should not be authenticated with a requested password (33 ms)
    Fulfilled
      ✓ should update the password with a valid request (11 ms)
      ✓ should be authenticated with a updated password (26 ms)
      ✓ should not be authenticated with a previous password (23 ms)
```

### カバレッジ

カバレッジとは、テストによってどの程度コードが実行されたか表す割合です。Jestではテスト実行コマンドにオプションを付与することでカバレッジを表示することができ、さらにこの時、テストされていないファイルとその対象コードの行まで把握することが可能です。これによって、テスト実行状況を確認し方針の決定に役立てることに繋がります。  

> 参考： [Coverage Reporting](https://create-react-app.dev/docs/running-tests#coverage-reporting) - Running Tests | Create React App  

### React Testing Library

UIテストでは、実際のユースケースに従って、ユーザーの操作 (クリックやフォーム入力など) を再現し、その結果期待した画面表示がされているかを確認します。[React Testing Library](https://testing-library.com/docs/react-testing-library/intro)はそのために有用な機能を提供するパ
ッケージです。  

> 参考： [React Testing Libraryの使い方 - Qiita](https://qiita.com/ossan-engineer/items/,4757d7457fafd44d2d2f)  

### テスト状態初期化

React Testing Library によって、コンポーネントをレンダリングするには`render`関数を使用しますが、この時テスト対象のコードで**Redux**や**React Helmet**などを使用している場合は実際の環境に適合させるためにそれぞれ`Provider`を提供する必要があります。  

```tsx
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import store from 'store';
import App from 'App';

render(
  <Provider store={store}>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </Provider>
);
```

ここで、**Redux Store**や**React Router**などの状態はリセットされないことに注意が必要です。例えば先行するテストでページ移動を行っていた場合には、次のテストで上記の`render`を再度行ったとしても、ページ移動後のコンポーネントがレンダリングされることになります。つまりテスト内で何らかの変更を加えた場合には以降のテストに影響を及ぼす恐れがあります。  

テスト毎にこれらを初期状態に戻すには、`beforeEach`などを用いて各状態の初期化を行いますが、ここで行うべき処理はそれぞれ異なります。  

例えば**Redux Store**をリセットするには、テスト毎に`configureStore`から再度生成することが一つの解決策となります。  

```ts :src/mocks/utils/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from 'store';

export let store = configureStore({ reducer: rootReducer });

export const initializeStore = () =>
  (store = configureStore({ reducer: rootReducer }));
```

上記のようにテスト用の`store`を新たに作成しておきます。尚、このようなテスト環境のためのファイルは`__test__`ではなく、別のディレクトリ  (ここでは`mocks`) に配置します。  

用意した`store`を`import`し、再生成用の関数を`beforeEach`内部で実行することで状態を元に戻すことができます。  

```ts
import { initializeStore, store } from 'mocks/utils/store';

describe('Thunk for a forgot password', () => {
  beforeEach(() => {
    initializeStore();
  });
  ...
```

次に**React Router**を初期状態に戻す場合を考えます。ドキュメントに従って、これには`BrowserRouter`ではなく、`MemoryRouter`を利用する方法に変更します。これによって状態を残さずに次のテストに移ることができるようになりました。  

```tsx
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import store from 'store';
import Routes from 'Routes';
import App from 'App';

render(
  <Provider store={store}>
    <HelmetProvider>
      <MemoryRouter initialEntries={['/login']}>
        <Routes />
      </MemoryRouter>
    </HelmetProvider>
  </Provider>
);
```

> 参考：  
> [Setup and Teardown · Jest](https://jestjs.io/docs/setup-teardown)  
> [Testing](https://reactrouter.com/web/guides/testing) - React Router: Declarative Routing for React.js  

### Mock Server Worker (MSW)

APIリクエストを伴うテストでは、実際のサーバーに対するリクエストは行わず、代わりにAPIをモックを使用して行うことが一般的のようです。これによって、バックエンドサーバーが利用できない場合にもテストが実行可能となる他、通信速度にも影響を受けることのない高速な処理が期待できます。  

Jestにはモックの機能も付随しているので、これによってもAPIモックを扱うことが可能です。ただ、HTTPヘッダーやCookieを用いたリクエストやレスポンスを再現するには準備が大変そうです。  

別の方法として、モックサーバーを用意しリクエストをそこに向けるものがあります。これも場合によっては、本来のバックエンドサーバーのURLとは異なるエンドポイントにリクエストを投げるためにテストコードを修正することになります。  

今回利用しているAPIモック用パッケージである [Mock Service Worker (MSW)](https://mswjs.io) では、HTTPヘッダーやCookieを容易に扱うことができる上、それらによってテストコードを変更する必要がありません。また本来のリクエストをそのまま利用可能で、モックの使用有無に関わらずテストコードを記述することができます。  

さらに、このMSWはテスト実行時だけでなくブラウザ環境でも動作させることが可能で、リクエストやレスポンスの挙動をブラウザの開発者ツールから確認することもでき、テストに問題が発生した場合にその要因の解明に役立ちます。  

> 参考：  
> [Stop mocking fetch](https://kentcdodds.com/blog/stop-mocking-fetch)  
> [Build a ReactJS App workshop](https://github.com/kentcdodds/bookshelf) | GitHub  
> [Comparison - Mock Service Worker Docs](https://mswjs.io/docs/comparison)  
> [Examples of Mock Service Worker usage](https://github.com/mswjs/examples) | GitHub  

#### MSWの構成

まずMSWのインストールを開発環境のみに行います。  

```bash
yarn add msw --dev
```

次に、処理するリクエストとそれに対するレスポンスの定義を`src/mocks/handlers.ts`に記述します。  

```ts :src/mocks/handlers.ts
import { rest } from 'msw'

export const handlers = [
  rest.post('http://backend/login', () => {}),
]
```

上記のコードは、`http://backend/login`に対する`POST`リクエストを捕捉する [Request handler](https://mswjs.io/docs/getting-started/mocks/rest-api#request-handler)を`handlers`に格納しています。第二引数で何も返していないのでこれはまだ動作しません。  

第二引数として渡されるのは、[Response resolver](https://mswjs.io/docs/getting-started/mocks/rest-api#response-resolver)で、リクエストで送られてきたデータに対するレスポンスを作り上げます。これは以下の引数を持つ関数で、下のコードのようにリクエストのヘッダーやCookieを簡単に取得することができます。  

> - req, an information about a matching request;
> - res, a functional utility to create the mocked response;
> - ctx, a group of functions that help to set a status code, headers, body, etc. of the mocked response.
>
> [https://mswjs.io/docs/getting-started/mocks/rest-api#response-resolver](https://mswjs.io/docs/getting-started/mocks/rest-api#response-resolver)

```ts :src/mocks/handlers.ts
import { rest } from 'msw'

export const handlers = [
  rest.post('http://backend/login', (req, res, ctx) => {
    // Cookieから`session_id`を取得
    const sessionId = req.cookies.session_id;
    // HTTPヘッダーから`X_XSRF_TOKEN`を取得
    const token = req.headers.get('X_XSRF_TOKEN');

     ...

    return res(
      ctx.status(200),
      // Set-Cookie (オプションも指定可能)
      ctx.cookie('session_id', encryptedSessionId, { httpOnly: true }),
      ctx.json({
        ...
       })
    );
  }),
]
```

> 参考： [Cookies - Recipes - Mock Service Worker Docs](https://mswjs.io/docs/recipes/cookies)  

作成した`handler`を利用するには、ブラウザ環境とNode (テスト) 環境で異なるプロセスが必要です。  

##### ブラウザ環境の場合

ブラウザ環境で実行する場合は**Service Worker**を起動します。そのために必要なコードは以下のコマンドを実行することで生成することができます。  

```bash
npx msw init public/ --save
```

次に、`src/mocks/browser.ts`を作成し、`handler`から`worker`を構成します。  

```ts :src/mocks/browser.ts
import { setupWorker } from 'msw';
import { handlers } from './handlers';

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers);
```

`src/index.tsx`に以下のコードを追加し、`worker`を開発環境の条件の下に実行します。  

```tsx :src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
...

// 開発環境 ('development')の場合に'Service Worker'を起動
if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./mocks/browser');
  worker.start();
}

ReactDOM.render(
  ...
```

以上でブラウザ環境でMSWを利用できるようになり、以降のリクエストはMSWによって捕捉されることになります。尚、`handeler`に登録されていないリクエストは本来のエンドポイントに向かいます。  

> 参考：  
> [Browser - Getting Started - Mock Service Worker Docs](https://mswjs.io/docs/getting-started/integrate/browser)  
> [Debugging uncaught requests - Recipes - Mock Service Worker Docs](https://mswjs.io/docs/recipes/debugging-uncaught-requests)  

##### Node環境の場合

Node環境 (Jest実行時の環境) の場合はモックサーバーを起動します。`src/mocks/server.ts`を作成し、`handler`から`server`を構成します。  

```ts :src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup requests interception using the given handlers.
export const server = setupServer(...handlers);
```

次に、`src/setupTest.ts`に起動設定を追加します。  

```ts :src/setupTest.ts
...
import { server } from './mocks/server';

beforeAll(() => {
  // Enable the mocking in tests.
  server.listen();
});

afterEach(() => {
  // Reset any runtime handlers tests may use.
  server.resetHandlers();
});

afterAll(() => {
  // Clean up once the tests are done.
  server.close();
});
```

以上で、以降`yarn test`を実行した場合に行われたAPIリクエストはMSWによって捕捉されるようになりました。  

> 参考： [Node - Getting Started - Mock Service Worker Docs](https://mswjs.io/docs/getting-started/integrate/node#using-create-react-app)  

### GitHub Actions

**GitHub Actions** は、事前に規定したイベントが発生した際に、自動的に任意のコマンドを実行することができるサービスです。イベントに指定可能なものとして、リポジトリへのPushやPull Request があり、特定のBranchの場合に限定するといった条件を指定することも可能です。  

> 参考： [ワークフローをトリガーするイベント - GitHub Docs](https://docs.github.com/ja/actions/reference/events-that-trigger-workflows)  

GitHub Actions の導入や基本的な使用方法などについては別の記事で説明するとして、以降では今回作成したテストを実行する手順を確認していきます。方針としては、まず依存関係のインストールを行います。このときキャッシュが存在すれば手順をスキップします。次に`.env`ファイルを用意し、ビルド、テストを順に行います。  

キャッシュを利用した依存関係インストールを行うコードは以下のようになります。  

```yml :.github/workflows/test.yml
- name: Cache Node.js modules
  id: yarn-cache
  uses: actions/cache@v2
  with:
    path: ./frontend/node_modules
    key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
    restore-keys: |
      ${{ runner.os }}-yarn-
- name: Install dependencies
  if: steps.yarn-cache.outputs.cache-hit != 'true'
  run: yarn --frozen-lockfile
```

初回は通常通りインストールを行い、キャッシュを`path`に指定したパスに保存し、`if`を用いることでインストール実行の条件を定めます。また、インストール時`--frozen-lockfile`を指定することで`yarn.lock`が更新されないようにします。  

> 参考：  
> [Node - Yarn](https://github.com/actions/cache/blob/main/examples.md#node---yarn) - cache/examples.md at main · actions/cache - GitHub  
> [Skipping steps based on cache-hit](https://github.com/actions/cache#Skipping-steps-based-on-cache-hit) - actions/cache - GitHub  
> [Installing dependencies](https://docs.github.com/en/actions/guides/building-and-testing-nodejs#example-using-yarn) - Building and testing Node.js - GitHub Docs  

次に、`.env`ファイルの作成、ビルド、テストを行います。  

```yml :.github/workflows/test.yml
- name: Set environment variables
  run: mv .env.example .env

- run: yarn build --if-present
- run: yarn test
```

実行するコマンド自体は以上となります。次に、これらを複数のNodeバージョンで実行するように設定を加えます。  

```yml :.github/workflows/test.yml
strategy:
  matrix:
    node-version: [10.x, 12.x, 14.x, 15.x]

steps:
  - name: Check out repository code
    uses: actions/checkout@v2

  - name: Use Node.js ${{ matrix.node-version }}
    uses: actions/setup-node@v1
    with:
      node-version: ${{ matrix.node-version }}
```

> 参考： [Specifying the Node.js version](https://docs.github.com/en/actions/guides/building-and-testing-nodejs#specifying-the-nodejs-version) - Building and testing Node.js - GitHub Docs  

最後に、作業ディレクトリの指定を行います。今回はフロントエンドのコードがリポジトリのルートではなく`frontend`ディレクトリに存在するので`working-directory`を`./frontend`としています。  

```yml :.github/workflows/test.yml
defaults:
  run:
    working-directory: ./frontend
```

最終的には以下のようなコードを`.github/workflows/test.yml`に作成します。(尚、複数の`job`が存在する場合のコードを示すためにバックエンド側の記述も一部含まれています。)  

```yml :.github/workflows/test.yml
name: CI

on: [push]

jobs:
  phpunit: # バックエンド側
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend
    steps:
      ...

  build: # フロントエンド側
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend

    strategy:
      matrix:
        node-version: [10.x, 12.x, 14.x, 15.x]

    steps:
      - name: Check out repository code
        uses: actions/checkout@v2

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}

      - name: Cache Node.js modules
        id: yarn-cache
        uses: actions/cache@v2
        with:
          path: ./frontend/node_modules
          key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
          restore-keys: |
            ${{ runner.os }}-yarn-
      - name: Install dependencies
        if: steps.yarn-cache.outputs.cache-hit != 'true'
        run: yarn --frozen-lockfile

      - name: Set environment variables
        run: mv .env.example .env

      - run: yarn build --if-present
      - run: yarn test
```

以降は、GitHubにコードをpushすることで、作成したテストが指定したNodeのバージョンで実行されることになります。  

> 参考： [Building and testing Node.js - GitHub Docs](https://docs.github.com/en/actions/guides/building-and-testing-nodejs)  

## Markdown

ReactでMarkdownを扱うには、Markdown記法で記述された文章をJSXに変換することが求められます。これを実現する方法として、[markdown-to-jsx](https://github.com/probablyup/markdown-to-jsx)を使用します。  

> 参考： [material-ui/Terms.js at master · mui-org/material-ui](https://github.com/mui-org/material-ui/blob/master/docs/src/pages/premium-themes/onepirate/Terms.js) - GitHub  

## markdown-to-jsx

markdown-to-jsxを利用することで、Markdownの各要素 (`h1`や`p`など) を任意のコンポーネントに変換することが可能で、これによってMaterial-UIとの併用も容易に実現できます。  

利用する際には型定義ファイルも必要になるので同時にインストールを行います。  

```bash
yarn add markdown-to-jsx @types/markdown-to-jsx
```

Markdownへの変換は`Markdown`コンポーネントによって行われ、この時`options`プロパティによってどのようなコンポーネントに変換するか指定することができます。  

`Markdown`を利用する度に毎回このような指定を行うのはコードの重複になるので、`options`を指定したコンポーネントを新たに作成し、JSXに変換する際にはこちらを利用することにします。  

`Markdown.tsx`というファイルを作成し、単に`options`指定した`Markdown`を`export`するような実装を行います。まず`options`が空の状態のコードは以下のようになります。  

```tsx :src/templates/Markdown.tsx
import { ReactNode } from 'react';
import MarkdownToJsx, { MarkdownToJSX } from 'markdown-to-jsx';

const options: MarkdownToJSX.Options = {};

const Markdown: React.FC = ({ children }) => {
  return (
    <MarkdownToJsx options={options}>
      {children as string & ReactNode}
    </MarkdownToJsx>
  );
};

export default Markdown;
```

上記のコードでは、`Markdown`ではなく`MarkdownToJsx`を`import`しています。これは`default export`されているので任意の名前にすることが可能で、ここでは`MarkdownToJsx`という名前にしています。`Markdown`コンポーネントとして作成しており名前が衝突するのでこのような方法を採っています。  

次に、`MarkdownToJsx`をマウスオーバーして得られた型情報から、`options`の型は`MarkdownToJSX.Options`であることが判明したので、そのための`namespace`を`import`しています。  

そして、`MarkdownToJsx`に与える`children`は`string`であることが求められるので、`as string`記述して型アサーションを行うことで対処します。  

それでは次に`options`を指定してMaterial-UIを使用できるようにしていきます。  

```tsx :src/templates/Markdown.tsx
const options: MarkdownToJSX.Options = {
  overrides: {
    h1: {
      component: (props) => (
        <Typography gutterBottom component='h1' variant='h3' {...props} />
      ),
    },
    li: {
      component: (props) => <Typography component='li' {...props} />,
    },
  }
};
```

上記のように、`overrides`のHTML要素プロパティに対し、変換に使用するコンポーネントを指定することでデフォルトの変換機能を上書きすることができます。これでMarkdownにMaterial-UIをスタイルを適用することができるようになりました。  

> 参考： [material-ui/Markdown.js at master · mui-org/material-ui](https://github.com/mui-org/material-ui/blob/master/docs/src/pages/premium-themes/onepirate/modules/components/Markdown.js) - GitHub  

`h1`などの見出しは`id`属性が自動的に付与されます。しかし日本語では機能しないのでその場合は`options`に以下のような指定を行います。  

```tsx :src/templates/Markdown.tsx
const options: MarkdownToJSX.Options = {
  slugify: (str) => str, // 自動生成されるid属性を日本語で利用
  overrides: {
      ...
```

> 参考： [options.slugify](https://github.com/probablyup/markdown-to-jsx#optionsslugify) - probablyup/markdown-to-jsx - GitHub  

以上で、MarkdownをReactで扱うための準備は完了です。  

## まとめ

以上、SPAのフロントエンドを構成する上で必要となる要素 (状態管理やルーティングなど) 及びそれらを実現するための技術 (ReduxやReact Routerなど) について、その意義を確認しつつ初めに行うべき実装を記述してきました。  

今回利用したパッケージ群はその選定理由に導入容易性を含んでおり、比較的簡単に実装まで行うことができたと思います。しかし一方で、無意味なコードや重複を避け、無駄がなく可読性や再利用性が高いコードを構成するためには、それぞれの公式ドキュメントやコードを読み理解した上で実装することが必要だと思いました。ここで今まで初期設定という形で実装してきたコードもそれを志向しています。  

import { cloneElement, type ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../lib/contextLib";

interface Props {
  children: ReactElement;
}

export default function UnauthenticatedRoute(props: Props): ReactElement {
  const { isAuthenticated } = useAppContext();
  const { children } = props;

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  // cloneElement，确保在 UnauthenticatedRoute 这种路由组件中，传递给其子组件的 状态（state） 能够被正确地处理和接收。
  return cloneElement(children, props);
}

/*
为什么需要 `cloneElement`？

在 React 中，父组件向子组件传递数据通常通过 props（属性）。
但是，当父组件（这里是路由组件 `UnauthenticatedRoute`）不是直接显式地渲染子组件，而是通过 `props.children` 来渲染时，问题就来了。`props.children` 可能是一个组件实例，你不能直接修改它的 props。
`cloneElement` 的作用：它可以克隆一个现有的 React 元素（即 `props.children）`，并同时为其注入新的 `props` 或覆盖原有的 `props`。这就像是为子组件“穿上”了一件父组件特制的外套（包含必要的状态信息）。
*/

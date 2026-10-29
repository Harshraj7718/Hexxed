// Stand-in for the `framer` package so the Framer code component runs outside Framer.
export const ControlType = new Proxy({}, { get: (_, k) => String(k) })
export const addPropertyControls = () => {}
export const useIsStaticRenderer = () => false

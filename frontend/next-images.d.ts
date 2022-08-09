// > Instead of editing `next-env.d.ts`,
// > you can include additional types by adding a new file e.g. `additional.d.ts`
// > and then referencing it in the`include` array in your`tsconfig.json`.
// >> https://nextjs.org/docs/basic-features/typescript
//
// If the type remains `any`, try to remove `next-env.d.ts` and run `yarn dev`.
// Or run `TypeScript: Restart TS server` or `Developer: Reload Window`
// from "View - Command Palette" (command + shift + P).

/** It override the type of `next/image-types/global` in `next-env.d.ts`. */
declare module '*.svg' {
  const content: {
    /** Relative path to the image */
    src: string;
    /** Image height by pixel */
    height: number;
    /** Image width by pixel */
    width: number;
  };

  export default content;
}

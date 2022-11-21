import {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useContext,
} from "react";
import type { FileHasherWorker } from "../file-hasher.worker";

type FileHasherWorkerContextValue = {
  worker: MutableRefObject<FileHasherWorker | undefined>;
};

const FileHasherWorkerContext = createContext<FileHasherWorkerContextValue>({
  worker: undefined as any,
});

export const FileHasherWorkerProvider = ({
  children,
  worker,
}: PropsWithChildren<FileHasherWorkerContextValue>) => (
  <FileHasherWorkerContext.Provider value={{ worker }}>
    {children}
  </FileHasherWorkerContext.Provider>
);

export const useFileHasher = () => {
  const { worker } = useContext(FileHasherWorkerContext);

  return worker;
};

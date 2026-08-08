import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

type ParallaxCtx = {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  scrollY: MotionValue<number>;
  enabled: boolean;
};

const Ctx = createContext<ParallaxCtx | null>(null);

function useFinePointer() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const sync = () => setFine(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return fine;
}

export function ParallaxScene({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const enabled = !reduce && fine;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const spring = { stiffness: 55, damping: 18, mass: 0.7 };
  const pointerX = useSpring(rawX, spring);
  const pointerY = useSpring(rawY, spring);

  const { scrollY } = useScroll();

  const value = useMemo<ParallaxCtx>(
    () => ({ pointerX, pointerY, scrollY, enabled }),
    [pointerX, pointerY, scrollY, enabled],
  );

  return (
    <Ctx.Provider value={value}>
      <section
        id={id}
        ref={ref}
        className={className}
        onPointerMove={
          enabled
            ? (event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                rawX.set((event.clientX - rect.left) / rect.width - 0.5);
                rawY.set((event.clientY - rect.top) / rect.height - 0.5);
              }
            : undefined
        }
        onPointerLeave={
          enabled
            ? () => {
                rawX.set(0);
                rawY.set(0);
              }
            : undefined
        }
      >
        {children}
      </section>
    </Ctx.Provider>
  );
}

type LayerProps = {
  children: ReactNode;
  className?: string;
  depthX?: number;
  depthY?: number;
  scroll?: number;
};

export function ParallaxLayer({
  children,
  className,
  depthX = 0,
  depthY = 0,
  scroll = 0,
}: LayerProps) {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("ParallaxLayer must be rendered inside ParallaxScene");

  const { pointerX, pointerY, scrollY, enabled } = ctx;

  const x = useTransform(() => (enabled ? -pointerX.get() * depthX : 0));
  const y = useTransform(() =>
    enabled
      ? -pointerY.get() * depthY + scrollY.get() * (scroll / 100)
      : 0,
  );

  return (
    <motion.div className={className} style={{ x, y }}>
      {children}
    </motion.div>
  );
}

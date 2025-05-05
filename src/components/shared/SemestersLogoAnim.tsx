import { motion } from "framer-motion";

interface SemestersLogoAnimProps {
  width: string
}

const SemestersLogoAnim: React.FC<SemestersLogoAnimProps> = ( { width } ) => {

    const paths = [
        { d: "M33 5.92308V15.7692L25 13.3077V3.46154L33 5.92308Z", fill: "black" },
        { d: "M1 28.0769V18.2308L9 20.6923V30.5385L1 28.0769Z", fill: "black" },
        { d: "M17 33L33 28.0769V21L25 23.1538L17 25.6154L13 24.3846V31.7692L17 33Z", fill: "black" },
        { d: "M9 10.8462L17 8.1022L21 9.47418V2.23077L17 1L1 5.92308V9L9 10.8462Z", fill: "black" },
        { d: "M33 18.2308L9 10.8462L1 9V15.7692L25 23.1538L33 21V18.2308Z", fill: "black" },
    ];

    return ( 
        <svg viewBox="0 0 34 34" width={width} xmlns="http://www.w3.org/2000/svg">
          {paths.map((path, index) => (
            <motion.path
              key={index}
              d={path.d}
              fill={path.fill}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 3,
                delay: index * 0.3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 0.5,
              }}
            />
          ))}
        </svg>
     );
}
 
export default SemestersLogoAnim;
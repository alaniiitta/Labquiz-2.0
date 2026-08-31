import topic01 from "./topic-01-explanations.json";
import topic04Part01 from "./topic-04-parts/part-01.json";
import topic04Part02 from "./topic-04-parts/part-02.json";
import topic04Part03 from "./topic-04-parts/part-03.json";
import topic04Part04 from "./topic-04-parts/part-04.json";
import topic04Part05 from "./topic-04-parts/part-05.json";
import topic04Part06 from "./topic-04-parts/part-06.json";

const explanationsByTopic = {
  "tema-01": topic01["tema-01"],
  "tema-04": {
    ...topic04Part01,
    ...topic04Part02,
    ...topic04Part03,
    ...topic04Part04,
    ...topic04Part05,
    ...topic04Part06,
  },
};

export default explanationsByTopic;

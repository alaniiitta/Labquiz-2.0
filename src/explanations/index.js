import topic01 from "./topic-01-explanations.json";
import topic04Part01 from "./topic-04-parts/part-01.json";
import topic04Part02 from "./topic-04-parts/part-02.json";
import topic04Part03 from "./topic-04-parts/part-03.json";
import topic04Part04 from "./topic-04-parts/part-04.json";
import topic04Part05 from "./topic-04-parts/part-05.json";
import topic04Part06 from "./topic-04-parts/part-06.json";
import topic05Part01 from "./topic-05-parts/part-01.json";
import topic05Part02 from "./topic-05-parts/part-02.json";
import topic05Part03 from "./topic-05-parts/part-03.json";
import topic05Part04 from "./topic-05-parts/part-04.json";
import topic05Part05 from "./topic-05-parts/part-05.json";
import topic05Part06 from "./topic-05-parts/part-06.json";
import topic05Part07 from "./topic-05-parts/part-07.json";
import topic06Part01 from "./topic-06-parts/part-01.json";
import topic06Part02 from "./topic-06-parts/part-02.json";
import topic06Part03 from "./topic-06-parts/part-03.json";
import topic06Part04 from "./topic-06-parts/part-04.json";
import topic06Part05 from "./topic-06-parts/part-05.json";
import topic07Part01 from "./topic-07-parts/part-01.json";
import topic07Part02 from "./topic-07-parts/part-02.json";
import topic07Part03 from "./topic-07-parts/part-03.json";
import topic07Part04 from "./topic-07-parts/part-04.json";
import topic07Part05 from "./topic-07-parts/part-05.json";
import topic07Part06 from "./topic-07-parts/part-06.json";
import topic08Part01 from "./topic-08-parts/part-01.json";
import topic08Part02 from "./topic-08-parts/part-02.json";
import topic08Part03 from "./topic-08-parts/part-03.json";
import topic08Part04 from "./topic-08-parts/part-04.json";
import topic08Part05 from "./topic-08-parts/part-05.json";
import topic08Part06 from "./topic-08-parts/part-06.json";
import topic08Part07 from "./topic-08-parts/part-07.json";
import topic08Part08 from "./topic-08-parts/part-08.json";
import topic08Part09 from "./topic-08-parts/part-09.json";
import topic08Part10 from "./topic-08-parts/part-10.json";
import topic08Part11 from "./topic-08-parts/part-11.json";
import topic08Part12 from "./topic-08-parts/part-12.json";

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
  "tema-05": {
    ...topic05Part01,
    ...topic05Part02,
    ...topic05Part03,
    ...topic05Part04,
    ...topic05Part05,
    ...topic05Part06,
    ...topic05Part07,
  },
  "tema-06": {
    ...topic06Part01,
    ...topic06Part02,
    ...topic06Part03,
    ...topic06Part04,
    ...topic06Part05,
  },
  "tema-07": {
    ...topic07Part01,
    ...topic07Part02,
    ...topic07Part03,
    ...topic07Part04,
    ...topic07Part05,
    ...topic07Part06,
  },
  "tema-08": {
    ...topic08Part01,
    ...topic08Part02,
    ...topic08Part03,
    ...topic08Part04,
    ...topic08Part05,
    ...topic08Part06,
    ...topic08Part07,
    ...topic08Part08,
    ...topic08Part09,
    ...topic08Part10,
    ...topic08Part11,
    ...topic08Part12,
  },
};

export default explanationsByTopic;

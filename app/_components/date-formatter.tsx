import { parseISO, format } from "date-fns";

import markdownStyles from "./markdown-styles.module.css";

type Props = {
  dateString: string;
};

const DateFormatter = ({ dateString }: Props) => {
  const date = parseISO(dateString);
  return <time className={markdownStyles.time} dateTime={dateString}>{format(date, "LLLL	d, yyyy")}</time>;
};

export default DateFormatter;

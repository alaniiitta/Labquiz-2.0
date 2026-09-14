const MS_PER_DAY=86400000;

export const EXAM_DATE=new Date(2026,10,8);

export function getCountdown(now=new Date()){
 const diff=EXAM_DATE.getTime()-now.getTime();
 const clamped=Math.max(0,diff);
 return {
  days:Math.floor(clamped/MS_PER_DAY),
  hours:Math.floor((clamped%MS_PER_DAY)/3600000),
  minutes:Math.floor((clamped%3600000)/60000),
  seconds:Math.floor((clamped%60000)/1000),
  isPast:diff<=0
 };
}

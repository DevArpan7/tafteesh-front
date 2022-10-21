import {
  addDays,
  endOfDay,
  startOfDay,
  startOfYear,
  startOfMonth,
  endOfMonth,
  endOfYear,
  addMonths,
  addWeeks,
  addYears,
  startOfWeek,
  endOfWeek,
  isSameDay,
  differenceInCalendarDays
} from "date-fns";
import format from 'date-fns/format'

import { useState,useEffect, useRef,} from "react";
import { DateRangePicker, DefinedRange, defaultStaticRanges } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
// import "./styles.css";

export default function App() {
  // const [state, setState] = useState([
  //   {
  //     startDate: new Date(),
  //     endDate: addDays(new Date(), 7),
  //     key: "selection"
  //   }
  // ]);

  const [calendar, setCalendar] = useState ([
        {
          startDate: new Date(),
          endDate: addDays(new Date(), 7),
          key: 'selection'
        }
      ])
    
      const [open, setOpen] = useState(false);
      const refOne = useRef(true)
    
      useEffect(() => {
        // setCalendar(format(new Date(), 'MM/dd/yyyy'))
        document.addEventListener("keydown", hideOnEscape, true)
        document.addEventListener("click", hideOnClickOutSide, true)
      }, [])
      const hideOnEscape = (e) => {
        // //console.log(e.key)
        if( e.key === "Escape" ) {
          setOpen(false)
        }
      }
    
      const hideOnClickOutSide = (e) => {
        // //console.log(refOne.current)
        // //console.log(e.target)
        if(refOne.current && !refOne.current.contains(e.target))
        setOpen(false)
      }
    
      // const handelSelect = (date) => {
      //   // //console.log(date)
      //   // //console.log(format(date, 'MM/dd/yyyy'))
      //   setCalendar(format(date, 'MM/dd/yyyy'))
      // }
  
  return (
    <div className="App">
      <input
      // value={calendar} 
      value={` ${format(calendar[0].startDate, 'MM/dd/yyyy')} to ${format(calendar[0].endDate, 'MM/dd/yyyy')} `}
      readOnly
      className='inputBox'
      onClick={ () => setOpen(open => ! open)}
      />
      <div ref={refOne}>
      {open &&
        <DefinedRange
          // onChange={(item) => setState([item.selection])}
          onChange={item => setCalendar([item.selection])}

          showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          months={2}
          ranges={calendar}
          open={open}
          direction="horizontal"
          staticRanges={[
            ...defaultStaticRanges,
            {
              label: "Last Three Week",
              range: () => ({
                startDate: startOfWeek(addWeeks(new Date(), -3)),
                endDate: endOfWeek(addWeeks(new Date(), -1))
              }),
              isSelected(range) {
                const definedRange = this.range();
                return (
                  isSameDay(range.startDate, definedRange.startDate) &&
                  isSameDay(range.endDate, definedRange.endDate)
                );
              }
            },
            {
              label: "Last Two Month",
              range: () => ({
                startDate: startOfMonth(addMonths(new Date(), -2)),
                endDate: endOfMonth(addMonths(new Date(), -1))
              }),
              isSelected(range) {
                const definedRange = this.range();
                return (
                  isSameDay(range.startDate, definedRange.startDate) &&
                  isSameDay(range.endDate, definedRange.endDate)
                );
              }
            },
            // {
            //   label: "This year",
            //   range: () => ({
            //     startDate: startOfYear(new Date()),
            //     endDate: endOfDay(new Date())
            //   }),
            //   isSelected(range) {
            //     const definedRange = this.range();
            //     return (
            //       isSameDay(range.startDate, definedRange.startDate) &&
            //       isSameDay(range.endDate, definedRange.endDate)
            //     );
            //   }
            // },
            { 
              label: "Custom",
              range: () => ({
                startDate: startOfYear(new Date()),
                endDate: endOfDay(new Date(), 1)
              }),
              isSelected(range) {
                const DateRangePicker = this.range();
                return (
                  isSameDay(range.startDate, DateRangePicker.startDate) &&
                  isSameDay(range.endDate, DateRangePicker.endDate)
                );
              }
            }
          ]}
          />
        }
    </div>
      ;
    </div>
  );
}
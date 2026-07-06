import { addDays, format, getDate, subDays } from "date-fns"
import { Provider } from "react-redux"

import CalendarDay from "@/src/components/CalendarDay"
import { MaterialUIWrapper } from "@/src/components/NextIndexWrapper"
import store from "@/src/redux/store"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

const todaysDate = new Date()
const todaysDayAsNumber = getDate(todaysDate)
const tomorrowsDate = addDays(todaysDate, 1)
const yesterdaysDate = subDays(todaysDate, 1)
const yesterdaysDayAsNumber = getDate(yesterdaysDate)
const formatDateAgenda = (date: Date) => format(date, "LLLL do, yyyy")
const todaysDateAgenda = formatDateAgenda(todaysDate)
const tomorrowsDateAgenda = formatDateAgenda(tomorrowsDate)
const yesterdaysDateAgenda = formatDateAgenda(yesterdaysDate)
const formatDateAsDayOfWeek = (date: Date) => format(date, "EEEE")
const todaysDateAsDayOfWeek = formatDateAsDayOfWeek(todaysDate)

const renderCalendarDay = () =>
  render(
    <MaterialUIWrapper>
      <Provider store={store}>
        <CalendarDay todaysDate={todaysDate} selectedDate={todaysDate} />
      </Provider>
    </MaterialUIWrapper>,
  )

test("renders correctly with today's date as selectedDate prop", () => {
  renderCalendarDay()
  expect(screen.getByText(String(todaysDayAsNumber))).toBeVisible()
  expect(
    screen.getByRole("button", { name: new RegExp(todaysDateAgenda, "i") }),
  ).toBeVisible()
  expect(
    screen.getByRole("button", {
      name: new RegExp(todaysDateAsDayOfWeek, "i"),
    }),
  ).toBeVisible()
})

const renderYesterdaysCalendarDay = () =>
  render(
    <MaterialUIWrapper>
      <Provider store={store}>
        <CalendarDay todaysDate={todaysDate} selectedDate={yesterdaysDate} />
      </Provider>
    </MaterialUIWrapper>,
  )

test("renders correctly with yesterdays's date as selectedDate props", () => {
  renderYesterdaysCalendarDay()
  expect(screen.getByText(String(yesterdaysDayAsNumber))).toBeVisible()
  expect(
    screen.getByRole("button", {
      name: new RegExp(yesterdaysDateAgenda, "i"),
    }),
  ).toBeVisible()
})

test("updates the Redux store when clicking the button", async () => {
  renderCalendarDay()
  userEvent.click(
    screen.getByRole("button", { name: new RegExp(todaysDateAgenda, "i") }),
  )
  // Source: https://jestjs.io/docs/expect#tomatchobjectobject
  await waitFor(() =>
    expect(store.getState()).toMatchObject({
      agenda: {
        agendaIsOpen: true,
        dateISOString: todaysDate.toISOString(),
      },
    }),
  )
  // Note: This is a fragile test, as it tests the implementation details of
})

test("updates the Redux store when using the keyboard", async () => {
  renderCalendarDay()
  userEvent.tab()
  userEvent.keyboard("{enter}")
  await waitFor(() =>
    expect(store.getState()).toMatchObject({
      agenda: {
        agendaIsOpen: true,
        dateISOString: todaysDate.toISOString(),
      },
    }),
  ) // Note: This is a fragile test, as it tests the implementation details.
})

test("has a CSS hover effect when hovered over with the mouse", async () => {
  renderCalendarDay()
  const classNameBeforeFocus = screen.getByTestId(
    new RegExp(todaysDateAgenda, "i"),
  ).className

  userEvent.hover(
    screen.getByRole("button", { name: new RegExp(todaysDateAgenda, "i") }),
  )
  await waitFor(() =>
    expect(
      screen.getByTestId(new RegExp(todaysDateAgenda, "i")).className,
    ).not.toEqual(classNameBeforeFocus),
  )

  userEvent.unhover(
    screen.getByRole("button", { name: new RegExp(todaysDateAgenda, "i") }),
  )
  await waitFor(() =>
    expect(
      screen.getByTestId(new RegExp(todaysDateAgenda, "i")).className,
    ).toEqual(classNameBeforeFocus),
  )
})

test("has a CSS hover effect when focused using the keyboard", async () => {
  renderCalendarDay()
  const classNameBeforeFocus = screen.getByTestId(
    new RegExp(todaysDateAgenda, "i"),
  ).className

  userEvent.tab()
  await waitFor(() =>
    expect(
      screen.getByTestId(new RegExp(todaysDateAgenda, "i")).className,
    ).not.toEqual(classNameBeforeFocus),
  )

  userEvent.tab()
  await waitFor(() =>
    expect(
      screen.getByTestId(new RegExp(todaysDateAgenda, "i")).className,
    ).toEqual(classNameBeforeFocus),
  )
})

const renderTomorrowsCalendarDay = () =>
  render(
    <MaterialUIWrapper>
      <Provider store={store}>
        <CalendarDay todaysDate={todaysDate} selectedDate={tomorrowsDate} />
      </Provider>
    </MaterialUIWrapper>,
  )

test("has a CSS hover effect on hover for a date that is not today", async () => {
  renderTomorrowsCalendarDay()
  const classNameTomorrowBeforeFocus = screen.getByTestId(
    new RegExp(tomorrowsDateAgenda, "i"),
  ).className

  userEvent.hover(
    screen.getByRole("button", { name: new RegExp(tomorrowsDateAgenda, "i") }),
  ) // place the focus on tomorrow's button
  await waitFor(() => {
    expect(
      screen.getByTestId(new RegExp(tomorrowsDateAgenda, "i")).className,
    ).not.toEqual(classNameTomorrowBeforeFocus)
  })

  userEvent.unhover(
    screen.getByRole("button", {
      name: new RegExp(tomorrowsDateAgenda, "i"),
    }),
  )
  await waitFor(() =>
    expect(
      screen.getByTestId(new RegExp(tomorrowsDateAgenda, "i")).className,
    ).toEqual(classNameTomorrowBeforeFocus),
  )
})

test("has a CSS effect highlighting today's date compared to tomorrow", async () => {
  renderCalendarDay()
  const classNameSameDate = screen.getByTestId(
    new RegExp(todaysDateAgenda, "i"),
  ).className

  cleanup()
  renderTomorrowsCalendarDay() // swap to tomorrow's date

  await waitFor(() =>
    expect(
      screen.getByTestId(new RegExp(tomorrowsDateAgenda, "i")).className,
    ).not.toEqual(classNameSameDate),
  )
})

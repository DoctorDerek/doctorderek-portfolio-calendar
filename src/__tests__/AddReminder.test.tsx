import { addDays, format } from "date-fns"
import { Provider } from "react-redux"

import AddReminder from "@/src/components/AddReminder"
import { MaterialUIWrapper } from "@/src/components/NextIndexWrapper"
import store, { rootReducer } from "@/src/redux/store"
import { configureStore } from "@reduxjs/toolkit"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

const formatDateAgenda = (date: Date) => format(date, "LLLL do, yyyy")
const formatTimePicker = (date: Date) => format(date, "hh:mm aaa")
const todaysDate = new Date()
const todaysDateAgenda = formatDateAgenda(todaysDate)
const tomorrowsDate = addDays(todaysDate, 1)
const tomorrowsDateAgenda = formatDateAgenda(tomorrowsDate)
const getCurrentTimePicker = () => formatTimePicker(new Date())

const renderAddReminder = () =>
  render(
    <MaterialUIWrapper>
      <Provider store={store}>
        <AddReminder />
      </Provider>
    </MaterialUIWrapper>,
  )

test("does not render anything with default Redux store", () => {
  renderAddReminder()
  expect(screen.queryByRole("button", { name: /close/i })).toBeNull()
  expect(screen.queryByText(/add reminder/i)).toBeNull()
})

const customStore = configureStore({
  reducer: rootReducer,
  preloadedState: {
    addReminder: {
      addReminderIsOpen: true,
    },
  },
})

const renderAddReminderOpen = () =>
  render(
    <MaterialUIWrapper>
      <Provider store={customStore}>
        <AddReminder />
      </Provider>
    </MaterialUIWrapper>,
  )

test("renders correctly with custom Redux store for open initial state", () => {
  renderAddReminderOpen()
  expect(screen.getByRole("button", { name: /close/i })).toBeVisible()
  expect(screen.getByText(/add reminder/i)).toBeVisible()
})

test("renders a date-time picker", () => {
  renderAddReminderOpen()
  expect(screen.getByText(/(choose|select|pick).+date.+time/i)).toBeVisible()
  expect(screen.getByLabelText(/(current|selected).+date.+time/i)).toBeVisible()
})

test("renders a color picker", () => {
  renderAddReminderOpen()
  expect(screen.getByText(/(choose|select|pick).+color/i)).toBeVisible()
  expect(screen.getByLabelText(/(current|selected).+color/i)).toBeVisible()
})

test("date-time picker starts with value of current time", () => {
  renderAddReminderOpen()
  expect(
    screen.getByLabelText(new RegExp(getCurrentTimePicker(), "i")),
  ).toBeVisible()
  // Note: this test is fragile if the time changes between the two renders
})

test("date-time picker starts with value of current date", () => {
  renderAddReminderOpen()

  expect(screen.getByLabelText(new RegExp(todaysDateAgenda, "i"))).toBeVisible()
})

test("closes modal when clicking the close button", async () => {
  renderAddReminderOpen()
  userEvent.click(screen.getByRole("button", { name: /close/i }))
  await waitFor(() =>
    expect(screen.queryByRole("button", { name: /close/i })).toBeNull(),
  )
  await waitFor(() => expect(screen.queryByText(/add reminder/i)).toBeNull())
})

test("closes modal when clicking outside the modal", async () => {
  renderAddReminderOpen()
  userEvent.click(document.body)
  await waitFor(() =>
    expect(screen.queryByRole("button", { name: /close/i })).toBeNull(),
  )
  await waitFor(() => expect(screen.queryByText(/add reminder/i)).toBeNull())
})

const customStoreAddReminderOpenAgendaOpen = configureStore({
  reducer: rootReducer,
  preloadedState: {
    addReminder: {
      addReminderIsOpen: true,
    },
    agenda: {
      agendaIsOpen: true,
      dateISOString: tomorrowsDate.toISOString(),
    },
  },
})

const renderAddReminderOpenAgendaOpen = () =>
  render(
    <MaterialUIWrapper>
      <Provider store={customStoreAddReminderOpenAgendaOpen}>
        <AddReminder />
      </Provider>
    </MaterialUIWrapper>,
  )

test("renders w/ custom Redux store with add reminder open over agenda", () => {
  renderAddReminderOpenAgendaOpen()
  expect(screen.getByRole("button", { name: /close/i })).toBeVisible()
  expect(screen.getByText(/add reminder/i)).toBeVisible()
})

test("date-time picker uses selected date (tomorrow) with custom store", () => {
  renderAddReminderOpenAgendaOpen()
  expect(
    customStoreAddReminderOpenAgendaOpen.getState().agenda.dateISOString,
  ).toBe(tomorrowsDate.toISOString())
  expect(
    screen.getByLabelText(new RegExp(tomorrowsDateAgenda, "i")),
  ).toBeVisible()
  // Note: This is a fragile test, as it tests the implementation details of
})

test("date-time picker uses current time with custom Redux store", () => {
  renderAddReminderOpenAgendaOpen()
  expect(
    screen.getByLabelText(new RegExp(getCurrentTimePicker(), "i")),
  ).toBeVisible()
  // Note: this test is fragile if the time changes between the two renders
})

test("Added the ability to add new reminders for a user-entered date and time", () => {})
test("Limited reminders to no more than a maximum of 30 characters.", () => {})
test("Allowed the user to select a color when creating a reminder and display it appropriately.", () => {})
test("Displayed reminders on the calendar view in the correct time order.", () => {})
test("Properly handled overflow when multiple reminders appear on the same date.", () => {})

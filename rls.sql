alter table users enable row level security;
alter table tasks enable row level security;
alter table attendance enable row level security;
alter table notifications enable row level security;
alter table daily_reports enable row level security;

create policy "users_select"
on users
for select
using (true);

create policy "users_update_own"
on users
for update
using (
auth.uid() = id
);

create policy "tasks_select"
on tasks
for select
using (true);

create policy "tasks_insert"
on tasks
for insert
with check (true);

create policy "tasks_update"
on tasks
for update
using (true);

create policy "attendance_select"
on attendance
for select
using (true);

create policy "attendance_insert"
on attendance
for insert
with check (true);

create policy "attendance_update"
on attendance
for update
using (true);

create policy "notifications_select"
on notifications
for select
using (true);

create policy "daily_reports_select"
on daily_reports
for select
using (true);

create policy "daily_reports_insert"
on daily_reports
for insert
with check (true);
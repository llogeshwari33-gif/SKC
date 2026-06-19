create table users (
    id uuid primary key,
    full_name text not null,
    email text unique not null,
    role text not null,
    phone text,
    is_active boolean default true,
    created_at timestamptz default now()
);

create table attendance (
    id bigint generated always as identity primary key,
    user_id uuid references users(id) on delete cascade,
    attendance_date date not null,
    check_in text,
    check_out text,
    status text default 'Present',
    created_at timestamptz default now()
);

create table tasks (
    id bigint generated always as identity primary key,
    title text not null,
    description text,
    assigned_by uuid references users(id),
    assigned_to uuid references users(id),
    priority text default 'Medium',
    due_date date,
    status text default 'Pending',
    completed_at timestamptz,
    created_at timestamptz default now()
);

create table daily_reports (
    id bigint generated always as identity primary key,
    user_id uuid references users(id) on delete cascade,
    report_date date not null,
    work_done text,
    issues text,
    created_at timestamptz default now()
);

create table notifications (
    id bigint generated always as identity primary key,
    user_id uuid references users(id) on delete cascade,
    title text not null,
    message text not null,
    is_read boolean default false,
    created_at timestamptz default now()
);
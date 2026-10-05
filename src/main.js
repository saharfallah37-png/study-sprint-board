import './style.css';

let editingTaskId = null;

document.documentElement.lang = 'fa';
document.documentElement.dir = 'rtl';
document.title = 'برد برنامه‌ریزی مطالعه';

// ساخت ساختار اصلی صفحه
document.querySelector('#app').innerHTML = `
  <main class="min-h-screen bg-slate-100 px-4 py-8 text-slate-800">
    <div class="mx-auto max-w-6xl">

      <header class="mb-8 rounded-2xl bg-white p-6 shadow-sm">
        <h1 class="text-2xl font-bold text-violet-700 md:text-3xl">
          برد برنامه‌ریزی مطالعه
        </h1>
        <p class="mt-3 leading-8 text-slate-500">
          کارهایت را برنامه‌ریزی کن، پیش ببر و پیشرفتت را ببین.
        </p>
      </header>

      <section
        aria-label="ابزارهای برد"
        class="mb-6 rounded-2xl bg-white p-5 shadow-sm"
      >
        <div class="grid grid-cols-1 items-end gap-4 md:grid-cols-3">

          <div>
            <label for="search-input" class="mb-2 block text-sm">
              جستجو در عنوان یا موضوع
            </label>

            <input
              id="search-input"
              type="search"
              placeholder="مثلاً جاوااسکریپت"
              class="w-full rounded-lg border border-slate-300 p-3 focus:outline-2 focus:outline-violet-600"
            >
          </div>

          <div>
            <label for="priority-filter" class="mb-2 block text-sm">
              فیلتر اولویت
            </label>

            <select
              id="priority-filter"
              class="w-full rounded-lg border border-slate-300 bg-white p-3 focus:outline-2 focus:outline-violet-600"
            >
              <option value="all">همه</option>
              <option value="low">کم</option>
              <option value="medium">متوسط</option>
              <option value="high">زیاد</option>
            </select>
          </div>

          <button
            id="clear-filters"
            type="button"
            class="rounded-lg bg-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            پاک کردن فیلترها
          </button>

        </div>
      </section>

      <section class="mb-6 rounded-2xl bg-white p-5 shadow-sm">
        <h2 class="mb-5 text-lg font-bold">افزودن کار جدید</h2>

        <form id="task-form" novalidate>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">

            <div>
              <label for="task-title" class="mb-2 block text-sm">
                عنوان کار
              </label>
              <input
                id="task-title"
                name="title"
                type="text"
                required
                aria-describedby="title-error"
                placeholder="مثلاً تمرین آرایه‌ها"
                class="w-full rounded-lg border border-slate-300 p-3 focus:border-violet-600 focus:outline-2 focus:outline-violet-600"
              >
              <p
                id="title-error"
                aria-live="polite"
                class="mt-2 text-sm text-red-700"
              ></p>
            </div>

            <div>
              <label for="task-subject" class="mb-2 block text-sm">
                موضوع
              </label>
              <input
                id="task-subject"
                name="subject"
                type="text"
                required
                aria-describedby="subject-error"
                placeholder="مثلاً جاوااسکریپت"
                class="w-full rounded-lg border border-slate-300 p-3 focus:border-violet-600 focus:outline-2 focus:outline-violet-600"
              >
              <p
                id="subject-error"
                aria-live="polite"
                class="mt-2 text-sm text-red-700"
              ></p>
            </div>

            <div>
              <label for="task-priority" class="mb-2 block text-sm">
                اولویت
              </label>
              <select
                id="task-priority"
                name="priority"
                class="w-full rounded-lg border border-slate-300 bg-white p-3 focus:border-violet-600 focus:outline-2 focus:outline-violet-600"
              >
                <option value="low">کم</option>
                <option value="medium" selected>متوسط</option>
                <option value="high">زیاد</option>
              </select>
            </div>

          </div>

          <button
            type="submit"
            class="mt-5 rounded-lg bg-violet-700 px-5 py-3 text-white hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            افزودن کار
          </button>

          <p
            id="form-message"
            role="status"
            class="mt-3 text-sm text-emerald-700"
          ></p>
        </form>
      </section>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">

        <section
          aria-labelledby="todo-heading"
          class="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4"
        >
          <h2
            id="todo-heading"
            class="mb-5 border-b border-slate-200 pb-4 text-lg font-bold text-slate-700"
          >
            برای انجام
          </h2>
          <div id="todo-list" class="min-h-40 space-y-4"></div>
        </section>

        <section
          aria-labelledby="doing-heading"
          class="min-w-0 rounded-2xl border border-amber-200 bg-amber-50 p-4"
        >
          <h2
            id="doing-heading"
            class="mb-5 border-b border-amber-200 pb-4 text-lg font-bold text-amber-800"
          >
            در حال انجام
          </h2>
          <div id="doing-list" class="min-h-40 space-y-4"></div>
        </section>

        <section
          aria-labelledby="done-heading"
          class="min-w-0 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
        >
          <h2
            id="done-heading"
            class="mb-5 border-b border-emerald-200 pb-4 text-lg font-bold text-emerald-800"
          >
            انجام‌شده
          </h2>
          <div id="done-list" class="min-h-40 space-y-4"></div>
        </section>

      </div>
    </div>
  </main>
`;

// داده‌های اولیه
const starterTasks = [
  {
    id: 1,
    title: 'تمرین آرایه‌ها',
    subject: 'جاوااسکریپت',
    priority: 'high',
    status: 'todo',
  },
  {
    id: 2,
    title: 'یادگیری ده لغت جدید',
    subject: 'زبان انگلیسی',
    priority: 'low',
    status: 'todo',
  },
  {
    id: 3,
    title: 'تمرین ساخت تابع',
    subject: 'جاوااسکریپت',
    priority: 'high',
    status: 'doing',
  },
  {
    id: 4,
    title: 'حل تمرین احتمال',
    subject: 'ریاضی',
    priority: 'medium',
    status: 'doing',
  },
  {
    id: 5,
    title: 'مرور تگ‌های HTML',
    subject: 'طراحی وب',
    priority: 'low',
    status: 'done',
  },
  {
    id: 6,
    title: 'تمرین حلقه‌ها',
    subject: 'پایتون',
    priority: 'medium',
    status: 'done',
  },
];

const STORAGE_KEY = 'study-sprint-board-tasks-v1';

function copyStarterTasks() {
  return starterTasks.map(function (task) {
    return { ...task };
  });
}

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    // فقط وقتی هیچ داده‌ای ذخیره نشده، نمونه‌ها را برمی‌گردانیم
    if (saved === null) {
      return copyStarterTasks();
    }

    const parsedTasks = JSON.parse(saved);

    if (!Array.isArray(parsedTasks)) {
      throw new Error('Saved data must be an array.');
    }

    const validTasks = parsedTasks.every(function (task) {
      return (
        task !== null &&
        typeof task === 'object' &&
        (
          (typeof task.id === 'string' && task.id.trim() !== '') ||
          (typeof task.id === 'number' && Number.isFinite(task.id))
        ) &&
        typeof task.title === 'string' &&
        task.title.trim() !== '' &&
        typeof task.subject === 'string' &&
        task.subject.trim() !== '' &&
        ['low', 'medium', 'high'].includes(task.priority) &&
        ['todo', 'doing', 'done'].includes(task.status)
      );
    });

    const ids = parsedTasks.map(function (task) {
      return task === null ? null : String(task.id);
    });

    if (!validTasks || new Set(ids).size !== parsedTasks.length) {
      throw new Error('Saved tasks are invalid.');
    }

    return parsedTasks;
  } catch (error) {
    console.warn('بازیابی اطلاعات ممکن نشد:', error);

    return copyStarterTasks();
  }
}

let tasks = loadTasks();

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.warn('ذخیره اطلاعات ممکن نشد:', error);

    window.alert(
      'ذخیره در مرورگر انجام نشد. تغییرات فعلاً فقط در همین صفحه باقی می‌مانند.'
    );

    return false;
  }
}

const priorityLabels = {
  low: 'کم',
  medium: 'متوسط',
  high: 'زیاد',
};

const priorityStyles = {
  low: 'bg-sky-100 text-sky-800',
  medium: 'bg-amber-100 text-amber-800',
  high: 'bg-rose-100 text-rose-800',
};

// دسترسی به فرم و ورودی‌ها
const searchInput = document.querySelector('#search-input');
const priorityFilter = document.querySelector('#priority-filter');
const clearFiltersButton = document.querySelector('#clear-filters');
const taskForm = document.querySelector('#task-form');
const titleInput = document.querySelector('#task-title');
const subjectInput = document.querySelector('#task-subject');
const priorityInput = document.querySelector('#task-priority');

const titleError = document.querySelector('#title-error');
const subjectError = document.querySelector('#subject-error');
const formMessage = document.querySelector('#form-message');

const submitButton = taskForm.querySelector('button[type="submit"]');

// ساخت دکمهٔ لغو ویرایش
const cancelEditButton = document.createElement('button');
cancelEditButton.type = 'button';
cancelEditButton.textContent = 'لغو ویرایش';
cancelEditButton.hidden = true;

cancelEditButton.className =
  'ms-3 rounded-lg bg-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600';

submitButton.after(cancelEditButton);

// بازگرداندن فرم به حالت افزودن
function resetTaskForm() {
  editingTaskId = null;

  taskForm.reset();

  submitButton.textContent = 'افزودن کار';
  cancelEditButton.hidden = true;

  titleError.textContent = '';
  subjectError.textContent = '';
  formMessage.textContent = '';

  titleInput.removeAttribute('aria-invalid');
  subjectInput.removeAttribute('aria-invalid');
}

cancelEditButton.addEventListener('click', function () {
  resetTaskForm();
  titleInput.focus();
});

// ساخت یک کارت
function createTaskCard(task) {
  const card = document.createElement('article');
  card.className =
    'rounded-xl border border-slate-200 bg-white p-4 shadow-sm';
  card.dataset.id = task.id;

  const title = document.createElement('h3');
  title.className = 'break-words font-bold leading-7 text-slate-800';
  title.textContent = task.title;

  const subject = document.createElement('p');
  subject.className = 'mt-2 break-words text-sm text-slate-500';
  subject.textContent = `موضوع: ${task.subject}`;

  const priority = document.createElement('span');
  priority.className =
    `mt-4 inline-block rounded-full px-3 py-1 text-xs ${priorityStyles[task.priority]}`;
  priority.textContent = `اولویت: ${priorityLabels[task.priority]}`;

  // انتخاب وضعیت
  const statusLabel = document.createElement('label');
  statusLabel.className = 'mt-4 block text-sm text-slate-600';
  statusLabel.textContent = 'وضعیت';
  statusLabel.htmlFor = `status-${task.id}`;

  const statusSelect = document.createElement('select');
  statusSelect.id = `status-${task.id}`;
  statusSelect.className =
    'mt-2 w-full rounded-lg border border-slate-300 bg-white p-2 text-sm focus:outline-2 focus:outline-violet-600';

  const statusOptions = [
    { value: 'todo', label: 'برای انجام' },
    { value: 'doing', label: 'در حال انجام' },
    { value: 'done', label: 'انجام‌شده' },
  ];

  statusOptions.forEach(function (status) {
    const option = document.createElement('option');
    option.value = status.value;
    option.textContent = status.label;

    statusSelect.append(option);
  });

  statusSelect.value = task.status;

  statusSelect.addEventListener('change', function () {
    task.status = statusSelect.value;
    saveTasks()
    renderBoard();

    document.getElementById(`status-${task.id}`).focus();
  });

  // دکمهٔ ویرایش
  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.textContent = 'ویرایش';
  editButton.setAttribute('aria-label', `ویرایش کار ${task.title}`);

  editButton.className =
    'mt-4 me-2 rounded-lg bg-violet-50 px-4 py-2 text-sm text-violet-700 hover:bg-violet-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600';

  editButton.addEventListener('click', function () {
    editingTaskId = task.id;

    titleInput.value = task.title;
    subjectInput.value = task.subject;
    priorityInput.value = task.priority;

    titleError.textContent = '';
    subjectError.textContent = '';
    formMessage.textContent = '';

    titleInput.removeAttribute('aria-invalid');
    subjectInput.removeAttribute('aria-invalid');

    submitButton.textContent = 'ذخیره تغییرات';
    cancelEditButton.hidden = false;

    taskForm.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    titleInput.focus({ preventScroll: true });
  });

  // دکمهٔ حذف
  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = 'حذف';
  deleteButton.setAttribute('aria-label', `حذف کار ${task.title}`);

  deleteButton.className =
    'mt-4 rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-700 hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600';

  deleteButton.addEventListener('click', function () {
    const confirmed = window.confirm(
      `آیا کار «${task.title}» حذف شود؟`
    );

    if (!confirmed) {
      return;
    }

    tasks = tasks.filter(function (item) {
      return item.id !== task.id;
    }); 
    
    saveTasks()

    if (editingTaskId === task.id) {
      resetTaskForm();
    }

    renderBoard();
    titleInput.focus();
  });

  card.append(
    title,
    subject,
    priority,
    statusLabel,
    statusSelect,
    editButton,
    deleteButton
  );

  return card;
}

function renderBoard() {
  const statuses = ['todo', 'doing', 'done'];

  const query = searchInput.value.trim().toLowerCase();
  const selectedPriority = priorityFilter.value;

  statuses.forEach(function (status) {
    const column = document.querySelector(`#${status}-list`);

    column.replaceChildren();

    // همهٔ کارهای این ستون، قبل از اعمال فیلتر
    const columnTasks = tasks.filter(function (task) {
      return task.status === status;
    });

    // کارهایی که هم با جستجو و هم با اولویت مطابقت دارند
    const visibleTasks = columnTasks.filter(function (task) {
      const matchesSearch =
        task.title.toLowerCase().includes(query) ||
        task.subject.toLowerCase().includes(query);

      const matchesPriority =
        selectedPriority === 'all' ||
        task.priority === selectedPriority;

      return matchesSearch && matchesPriority;
    });

    if (visibleTasks.length === 0) {
      const message = document.createElement('p');

      message.className =
        'py-8 text-center text-sm leading-7 text-slate-500';

      if (columnTasks.length === 0) {
        message.textContent = 'هنوز کاری در این ستون نیست.';
      } else {
        message.textContent =
          'کاری مطابق با جستجو و فیلتر فعلی پیدا نشد.';
      }

      column.append(message);
      return;
    }

    visibleTasks.forEach(function (task) {
      const card = createTaskCard(task);
      column.append(card);
    });
  });
}

// افزودن کار یا ذخیرهٔ ویرایش
taskForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const subject = subjectInput.value.trim();
  const priority = priorityInput.value;

  titleError.textContent = '';
  subjectError.textContent = '';
  formMessage.textContent = '';

  titleInput.removeAttribute('aria-invalid');
  subjectInput.removeAttribute('aria-invalid');

  if (title === '') {
    titleError.textContent = 'عنوان کار را وارد کن.';
    titleInput.setAttribute('aria-invalid', 'true');
  }

  if (subject === '') {
    subjectError.textContent = 'موضوع مطالعه را وارد کن.';
    subjectInput.setAttribute('aria-invalid', 'true');
  }

  if (title === '' || subject === '') {
    if (title === '') {
      titleInput.focus();
    } else {
      subjectInput.focus();
    }

    return;
  }

  let successMessage = '';

  if (editingTaskId !== null) {
    const taskToEdit = tasks.find(function (task) {
      return task.id === editingTaskId;
    });

    if (!taskToEdit) {
      resetTaskForm();
      formMessage.textContent = 'این کار دیگر وجود ندارد.';
      titleInput.focus();
      return;
    }

    taskToEdit.title = title;
    taskToEdit.subject = subject;
    taskToEdit.priority = priority;

    successMessage = 'تغییرات کار ذخیره شد.';
  } else {
    const newTask = {
      id: crypto.randomUUID(),
      title: title,
      subject: subject,
      priority: priority,
      status: 'todo',
    };

    tasks.push(newTask);

    successMessage = 'کار جدید اضافه شد.';
  }

const savedSuccessfully = saveTasks();

renderBoard();
resetTaskForm();

formMessage.textContent = savedSuccessfully
  ? successMessage
  : 'تغییر انجام شد، اما در مرورگر ذخیره نشد.';

titleInput.focus();
});
searchInput.addEventListener('input', function () {
  renderBoard();
});

priorityFilter.addEventListener('change', function () {
  renderBoard();
});

clearFiltersButton.addEventListener('click', function () {
  searchInput.value = '';
  priorityFilter.value = 'all';

  renderBoard();
  searchInput.focus();
}); 
const resetBoardButton = document.querySelector('#reset-board');

resetBoardButton.addEventListener('click', function () {
  const confirmed = window.confirm(
    'همهٔ کارهای فعلی با شش کار نمونه جایگزین شوند؟'
  );

  if (!confirmed) {
    return;
  }

  tasks = copyStarterTasks();

  const savedSuccessfully = saveTasks();

  resetTaskForm();

  searchInput.value = '';
  priorityFilter.value = 'all';

  renderBoard();

  formMessage.textContent = savedSuccessfully
    ? 'برد به کارهای نمونه بازنشانی شد.'
    : 'برد بازنشانی شد، اما در مرورگر ذخیره نشد.';
});
// نمایش اولیهٔ برد
renderBoard();
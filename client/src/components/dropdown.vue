<template>
  <div class="mx-1 z-50 w-1/3 absolute">
    <div
        class="lg:max-w-[356px] md:max-w-[356px] max-w-[343px] pb-52"
    >
      <div class="mt-8">
        <div
            class="dropdown-one w-full rounded outline-none bg-white relative mt-2 shadow-md"
        >
          <div
              class="shadow rounded w-full shadow px-3 py-2 absolute top-16 right-0 bg-white shadow-lg"
              id="drop-down-div"
          >
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </div>w


</template>
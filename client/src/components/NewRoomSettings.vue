<template>

  <div
      id="modal"
      class="py-12 dark:bg-black bg-gray-700 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0">
    <div class="container mx-auto w-11/12 md:w-2/3 max-w-lg flex justify-center" role="alert">
      <div class="relative w-96 rounded shadow-lg p-6 dark:bg-gray-800 bg-white">
        <p class="text-lg font-bold leading-none text-gray-800 dark:text-gray-100">Submit a question</p>
        <form class="mt-5">
          <div>
            <label class="text-xs font-semibold leading-3 text-gray-800 dark:text-gray-100"> Subject </label>
            <div
                class="py-1 rounded-lg px-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 mt-2">
              <select
                  class="text-xs focus:outline-none font-medium leading-3 text-gray-600 dark:text-gray-100 bg-transparent w-full">
                <option disabled selected>Select a subject</option>
                <option>withdraw</option>
                <option>Payment</option>
              </select>
            </div>
          </div>
          <div class="mt-4 flex flex-col">
            <label class="text-xs font-semibold leading-3 text-gray-800 dark:text-gray-100"> Question </label>
            <textarea
                class="text-xs font-medium leading-3 text-gray-500 dark:text-gray-400 resize-none h-20 bg-gray-50 dark:bg-gray-700 border rounded-lg border-gray-200 dark:border-gray-700 focus:outline-none px-4 py-3 mt-2"
                placeholder="Ask your question here..."></textarea>
          </div>
          <div class="mt-4 flex flex-col">
            <label class="text-xs font-semibold leading-3 text-gray-800 dark:text-gray-100"> Email </label>
            <input
                class="text-xs font-medium leading-3 text-gray-500 dark:text-gray-400 resize-none bg-gray-50 dark:bg-gray-700 border rounded-lg border-gray-200 dark:border-gray-700 focus:outline-none px-4 py-3 mt-2"
                placeholder="Enter your email"/>
          </div>
          <button id="submit"
                  class="mt-5 focus:outline-none px-5 py-3 bg-indigo-700 dark:bg-indigo-600 hover:bg-opacity-80 rounded text-xs font-semibold leading-3 text-gray-100">
            Submit
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
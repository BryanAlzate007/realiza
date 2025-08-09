
function Messages() {
<div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"> {/* Añadido dark mode bg/border/hover */}
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">Design Thinking</span> {/* Añadido dark mode text */}
              <span className="text-xs text-gray-500 dark:text-gray-400">Just Now</span> {/* Añadido dark mode text */}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">Design thinking is a problem-solving approach...</p> {/* Añadido dark mode text, line-clamp requiere plugin */}
             {/* Placeholder para indicador de audio */}
             <div className="mt-2 w-full h-4 bg-gray-300 dark:bg-gray-600 rounded"></div> {/* Placeholder audio wave */}
          </div>

}

export default Messages
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];

 
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  
  const maxPageButtons = 5; 
  let startPage, endPage;

  if (pageNumbers.length <= maxPageButtons) {
  
    startPage = 1;
    endPage = pageNumbers.length;
  } else {
    
    const maxPagesBeforeCurrentPage = Math.floor(maxPageButtons / 2); 
    const maxPagesAfterCurrentPage = Math.ceil(maxPageButtons / 2) - 1;

    if (currentPage <= maxPagesBeforeCurrentPage) {
     
      startPage = 1;
      endPage = maxPageButtons;
    } else if (currentPage + maxPagesAfterCurrentPage >= pageNumbers.length) {
     
      startPage = pageNumbers.length - maxPageButtons + 1;
      endPage = pageNumbers.length;
    } else {
      
      startPage = currentPage - maxPagesBeforeCurrentPage;
      endPage = currentPage + maxPagesAfterCurrentPage;
    }
  }

  
  const displayedPageNumbers = pageNumbers.slice(startPage - 1, endPage);

  if (pageNumbers.length <= 1) {
    return null; 
  }

  return (
    <div className="flex justify-center items-center mt-8 gap-2">
      <div className="flex items-center gap-2">
      
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => paginate(1)} 
          className="btn btn-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 hover:border-slate-500"
          disabled={currentPage === 1}
        >
          <ChevronsLeft size={16} />
        </motion.button>

        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => paginate(currentPage - 1)} 
          className="btn btn-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 hover:border-slate-500"
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
        </motion.button>

       
        <div className="flex items-center gap-1">
      
          {startPage > 1 && (
            <>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => paginate(1)} 
                className="btn btn-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 hover:border-slate-500"
              >
                1
              </motion.button>
              {startPage > 2 && (
                <span className="px-2 text-slate-400">...</span>
              )}
            </>
          )}

        
          {displayedPageNumbers.map(number => (
            <motion.button 
              key={number} 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => paginate(number)} 
              className={`btn btn-sm ${
                currentPage === number 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border border-cyan-400 shadow-lg shadow-cyan-500/25' 
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 hover:border-slate-500'
              }`}
            >
              {number}
            </motion.button>
          ))}

        
          {endPage < pageNumbers.length && (
            <>
              {endPage < pageNumbers.length - 1 && (
                <span className="px-2 text-slate-400">...</span>
              )}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => paginate(pageNumbers.length)} 
                className="btn btn-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 hover:border-slate-500"
              >
                {pageNumbers.length}
              </motion.button>
            </>
          )}
        </div>

       
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => paginate(currentPage + 1)} 
          className="btn btn-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 hover:border-slate-500"
          disabled={currentPage === pageNumbers.length}
        >
          <ChevronRight size={16} />
        </motion.button>

       
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => paginate(pageNumbers.length)} 
          className="btn btn-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 hover:border-slate-500"
          disabled={currentPage === pageNumbers.length}
        >
          <ChevronsRight size={16} />
        </motion.button>
      </div>

     
      <div className="ml-4 text-sm text-slate-400">
        Page {currentPage} of {pageNumbers.length}
      </div>
    </div>
  );
};

export default Pagination;


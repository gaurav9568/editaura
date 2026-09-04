"use client"
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const FaqBox = ({ faqs }) => {

    const [openIndexes, setOpenIndexes] = useState(Array(faqs.length).fill(false));
    const toggleFAQ = (index) => {
        setOpenIndexes((prev) =>
            prev.map((isOpen, i) => (i === index ? !isOpen : isOpen))
        );
    };

    return (
        <>
            {
                faqs.map((faq, i) => (
                    <div onClick={() => toggleFAQ(i)} key={i} className="w-full px-4 py-4 outline-1 outline-gray-900 cursor-pointer select-none">
                        <div>Q. {faq.question}</div>
                        <AnimatePresence initial={false}>
                            {openIndexes[i] && (
                                <motion.div
                                    key="content"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-2">
                                        A. {faq.answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                ))
            }
        </>
    )
}

export default FaqBox

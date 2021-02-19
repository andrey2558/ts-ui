import React, { FC, memo, useMemo } from 'react';
// import style from './Pagintaion.scss';
//
// const { pagination, container, actionBtn, nav, paginationItem, between, isActive } = style;

export type Meta = {
    limit: number;
    offset: number;
    total: number;
};
type Page = {
    id: number;
    text: number;
    offset: number;
    limit: number;
};
export type PaginationProps = {
    meta: Meta;
    onChange: (data: Meta) => void;
    className?:string;
};
const Pagination: FC<PaginationProps> = props => {
    const { meta, onChange, className = '' } = props;
    const isFirstPage: boolean = useMemo(() => {
        return meta.offset === 0;
    }, [meta.offset]);
    const isLastPage: boolean = useMemo((): boolean => {
        return meta.offset + meta.limit >= meta.total;
    }, [meta.offset, meta.limit, meta.total]);
    const featured: number = useMemo(() => {
        return Math.ceil(meta.total / meta.limit);
    }, [meta.total, meta.limit]);
    const activePages: Page[] = useMemo(() => {
        const total = meta.total;
        const limit = meta.limit;
        const pages = [];
        const count = Math.ceil(total / limit);

        for (let i = 0; i < count; i++) {
            pages.push({
                id: i,
                text: i + 1,
                offset: i === 0 ? 0 : limit * i,
                limit: limit,
            });
        }
        return pages;
    }, [meta.total, meta.limit]);
    const currentPage: number = useMemo(() => {
        const offset = meta.offset;
        const limit = meta.limit;

        if (offset && limit && offset >= limit) {
            return Math.floor(offset / limit) + 1;
        }

        return 1;
    }, [meta.offset, meta.limit]);
    const firstActivePages: Page[] = useMemo(() => {
        let items: Page[] = [];
        for (let i = currentPage; i < activePages.length && i < currentPage + 2; i++) {
            if (activePages[i]) {
                items.push(activePages[i]);
            }
        }
        return items;
    }, [activePages, currentPage]);
    const lastActivePages: Page[] = useMemo(() => {
        let items: Page[] = [];
        for (let i = currentPage - 1; i < activePages.length && i > currentPage - 4; i--) {
            if (activePages[i] && activePages[i].text !== currentPage) {
                items.push(activePages[i]);
            }
        }

        return items.reverse();
    }, [activePages, currentPage]);
    const update = (method: string | number) => {
        const offset = meta.offset;
        const limit = meta.limit;
        let obj: Meta = {
            limit: limit,
            offset: offset,
            total: meta.total,
        };

        if (typeof method === 'string') {
            switch (method) {
                case 'INC':
                    obj = {
                        ...obj,
                        offset: offset + meta.limit,
                        limit: limit,
                    };
                    break;

                case 'DEC':
                    obj = {
                        ...obj,
                        offset: offset > meta.limit ? offset - meta.limit : 0,
                        limit: limit,
                    };
                    break;

                case 'FIRST':
                    obj = {
                        ...obj,
                        offset: 0,
                        limit: limit,
                    };
                    break;

                case 'LAST':
                    obj = {
                        ...obj,
                        offset: limit * (featured - 1),
                        limit: limit,
                    };
                    break;
            }
        } else {
            obj = {
                ...obj,
                limit: activePages[method].limit,
                offset: activePages[method].offset,
            };
        }

        onChange(obj);
    };

    return (
        <div className={`pagination ${className}`}>
            {meta.total > meta.limit && (
                <div className="pagination__container">
                    <button className="pagination__actionBtn" disabled={isFirstPage} onClick={() => update('DEC')}>
                        <svg width="6" height="10" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M.03 9.28l2.24-2.14.75-.72 2.23-2.14.75.71-2.24 2.15-.74.71L.78 10l-.75-.72z"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.22 5.72L2.98 3.58l-.74-.72L0 .72.75 0l2.23 2.15.75.71 2.24 2.15-.75.71z"
                            />
                        </svg>
                    </button>

                    <div className="pagination__nav">
                        {currentPage !== 1 && currentPage !== 2 && currentPage !== 3 && (
                            <div className="pagination__between">
                                <div className="pagination__paginationItem" onClick={() => update('FIRST')}>
                                    1
                                </div>

                                {currentPage !== 4 && <div className="pagination__paginationItem">...</div>}
                            </div>
                        )}

                        {lastActivePages &&
                            lastActivePages.map(item => {
                                return (
                                    <div className="pagination__paginationItem" onClick={() => update(item.id)} key={item.id}>
                                        {item.text}
                                    </div>
                                );
                            })}

                        {((Array.isArray(lastActivePages) && lastActivePages.length !== 0) ||
                            (Array.isArray(firstActivePages) && firstActivePages.length !== 0)) && (
                            <div className="pagination__paginationItem isActive">{currentPage}</div>
                        )}

                        {firstActivePages &&
                            firstActivePages.map(item => {
                                return (
                                    <div className="pagination__paginationItem" onClick={() => update(item.id)} key={item.id}>
                                        {item.text}
                                    </div>
                                );
                            })}

                        {currentPage !== featured && currentPage !== featured - 1 && currentPage !== featured - 2 && (
                            <div className="pagination__between">
                                {currentPage !== featured - 3 && <div className="pagination__paginationItem">...</div>}
                                <div className="pagination__paginationItem" onClick={() => update('LAST')}>
                                    {featured}
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="pagination__actionBtn" disabled={isLastPage} onClick={() => update('INC')}>
                        <svg width="6" height="10" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M.03 9.28l2.24-2.14.75-.72 2.23-2.14.75.71-2.24 2.15-.74.71L.78 10l-.75-.72z"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.22 5.72L2.98 3.58l-.74-.72L0 .72.75 0l2.23 2.15.75.71 2.24 2.15-.75.71z"
                            />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default memo(Pagination);

import React from 'react';
import { Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import '../../css/userManagment.css';
import{RouteAuths} from "@/types/globalProps";

type PermissionType = 'read' | 'write' | 'delete';

export const PermissionsTable: React.FC<{ dataSource: RouteAuths[]; setDataSource: React.Dispatch<React.SetStateAction<RouteAuths[]>> }> = ({ dataSource, setDataSource }) => {

    const handleCheckboxChange = (
        record: RouteAuths,
        type: PermissionType,
        checked: boolean
    ) => {
        const updateItem = (item: RouteAuths): RouteAuths => {
            let newItem = { ...item };

            if (item.id === record.id) {
                newItem[type] = checked;

                if (type === 'read' && !checked) {
                    newItem.write = false;
                    newItem.delete = false;
                }

                if (type === 'write') {
                    if (!checked) {
                        newItem.delete = false;
                    } else {
                        newItem.read = true;
                    }
                }

                if (type === 'delete' && checked) {
                    newItem.read = true;
                    newItem.write = true;
                }

                // Alt başlıkların yetkilerini kontrol etme
                if (newItem.children && newItem.children.length > 0) {
                    newItem.children = newItem.children.map((child) => {
                        // Eğer ana başlığın yetkisi düşürülüyorsa, alt başlıkların yetkilerini de düşür
                        if (!newItem[type] && child[type]) {
                            return { ...child, [type]: false };
                        }
                        return updateItem(child);
                    });
                }
            } else if (item.children && item.children.length > 0) {
                // Alt başlıklarda değişiklik yapılıyorsa
                newItem.children = newItem.children?.map((child) => {
                    if (child.id === record.id) {
                        let newChild = { ...child };
                        newChild[type] = checked;

                        if (type === 'read' && !checked) {
                            newChild.write = false;
                            newChild.delete = false;
                        }

                        if (type === 'write') {
                            if (!checked) {
                                newChild.delete = false;
                            } else {
                                newChild.read = true;

                                // Ana başlığa da 'read' yetkisi ver
                                if (!newItem.read) {
                                    newItem.read = true;
                                }
                            }
                        }

                        if (type === 'delete' && checked) {
                            newChild.read = true;
                            newChild.write = true;

                            // Ana başlığa da 'read' ve 'write' yetkisi ver
                            if (!newItem.read || !newItem.write) {
                                newItem.read = true;
                                newItem.write = true;
                            }
                        }

                        // Alt başlık yetkileri ana başlık yetkilerini aşamaz
                        if (newChild[type] && !newItem[type]) {
                            newChild[type] = false;
                        }

                        return newChild;
                    } else {
                        return updateItem(child);
                    }
                });

                // Eğer alt başlıktan 'read' yetkisi alındıysa ve diğer alt başlıkların hiçbirinde 'read' yoksa, ana başlıktan 'read' yetkisini kaldır
                if (
                    type === 'read' &&
                    !newItem.children?.some((child) => child.read) &&
                    !newItem.children?.some((child) => child.write || child.delete)
                ) {
                    newItem.read = false;
                }
            }

            return newItem;
        };

        const updatedData = dataSource.map((item) => updateItem(item));
        setDataSource(updatedData);
    };

    const columns: ColumnsType<RouteAuths> = [
        {
            title: 'Naam',
            dataIndex: 'page_name',
            key: 'page_name',
        },
        {
            title: 'Read',
            dataIndex: 'read',
            render: (read: boolean, record: RouteAuths) => (
                <input
                    type="checkbox"
                    checked={read}
                    onChange={(e) => handleCheckboxChange(record, 'read', e.target.checked)}
                />
            ),
        },
        {
            title: 'Write',
            dataIndex: 'write',
            render: (write: boolean, record: RouteAuths) => (
                <input
                    type="checkbox"
                    checked={write}
                    onChange={(e) => handleCheckboxChange(record, 'write', e.target.checked)}
                />
            ),
        },
        {
            title: 'Delete',
            dataIndex: 'delete',
            render: (del: boolean, record: RouteAuths) => (
                <input
                    type="checkbox"
                    checked={del}
                    onChange={(e) => handleCheckboxChange(record, 'delete', e.target.checked)}
                />
            ),
        },
    ];
    const components = {
        body: {
            row: (props:any) => {
                const { className, children, ...restProps } = props;
                let newClassName = className;

                if (props['data-row-key'] && props['data-row-key'].toString().includes('expanded')) {
                    newClassName += ' expanded-row';
                }

                return (
                    <tr className={newClassName} {...restProps}>
                        {children}
                    </tr>
                );
            },
        },
    };


    return (
        <Table
            size="small"
            className="table col-sm-12 m-0 p-0 table-striped custom-table datatable contact-table"
            pagination={false}
            columns={columns}
            dataSource={dataSource}
            rowKey="id"
            components={components}
            expandable={{
                expandedRowClassName: (record: RouteAuths) => {
                    // id'nin 2'ye bölümünden kalanına göre sınıf ayarlıyoruz
                    return record.id ? record.id % 2 === 0 ? 'expanded-row-even' : 'expanded-row-odd': 'expanded-row-odd';
                },
            }}
        />
    );
};

export default PermissionsTable;

import { it, expect, describe } from 'vitest'
import { db } from './mocks/db'

describe('group', () => {
    it('should', () => {
        expect(1).toBeTruthy()
    })
    it('should', async () => {
        const firstProduct = db.product.create()
        console.log(firstProduct)
        const product = db.product.create({ name: 'Apple' });
        console.log(db.product.getAll())
        db.product.delete({ where: { id: { equals: product.id } } })
        db.product.delete({where: {}});
        
    })
})
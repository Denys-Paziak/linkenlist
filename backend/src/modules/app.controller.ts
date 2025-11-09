import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

@Controller('')
export class AppController {
	@Get('health')
	@ApiOperation({ summary: 'Health check' })
	@ApiResponse({ status: 200 })
	async health() { return { ok: true } }
}
